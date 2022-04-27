import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import ical from 'node-ical'

const dynamoDb = new DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const date = new Date()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const monthsKey = month + "_" + year
  const day = date.getDate()

  try {
  const getDays = {
    Key: { user: 'gty', month: monthsKey },
    TableName: process.env.UserMonths ?? 'noTable'
  }

  let data: { Item?: { user?: string, days?: Record<string, unknown>, month?: string}}
  data = await dynamoDb.get(getDays).promise()

  if (Object.keys(data).length === 0) {
    const newUser = {
      Item: { user: 'gty', month: monthsKey, days: { [day]: { } } },
      TableName: process.env.UserMonths ?? 'noTable'
    }
    await dynamoDb.put(newUser).promise()
    data = newUser
    console.log(data)
  }

  console.log('data', data)
  return { statusCode: 200, body: JSON.stringify(data.Item) }
  } catch (err) {
    console.log('err', err)
    return { statusCode: 500 }
  }

}

