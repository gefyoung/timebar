import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import { Day, Event } from '../lib/types'
import sort from '../lib/sort'
import { IAMAuthorizer } from '../lib/types'

const dynamoDb = new DynamoDB.DocumentClient()

export const handler = async (event: any) => {

  const { monthYear, userAlias }: { monthYear: string, userAlias: string } = JSON.parse(event.body ?? '')
  console.log('input', monthYear, userAlias)
  
  if (!process.env.PublicUsers) { return }
  const getDays = {
    Key: { userAlias: userAlias },
    TableName: process.env.PublicUsers
  }

  const users = await dynamoDb.get(getDays).promise()
  const userId = users.Item?.userId


  try {
    // i removed ' monthYear: monthYear' to see if i can get back all months'
    const getDays = {
      Key: { userId: userId, monthYear: monthYear },
      TableName: process.env.UserMonths ?? 'noTable'
    }

    const dynamoData = await dynamoDb.get(getDays).promise()
    const map: Map<string, Record<string, Event>> = new Map(Object.entries(dynamoData.Item?.days))

    console.log('returnedPublic::', dynamoData.Item)    
    if (!dynamoData.Item) { return }

    return JSON.stringify(sort(map))

  } catch (err) {
    console.log('err', err)
    return { statusCode: 500 }
  }

  return

}





