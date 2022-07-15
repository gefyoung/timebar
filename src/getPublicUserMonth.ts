import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import { Day, Event } from '../lib/types'
import sort from '../lib/sort'
import { IAMAuthorizer } from '../lib/types'

const dynamoDb = new DynamoDB.DocumentClient()

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  console.log('HELLO@@@@@@@@@@@@@@@@@@@@@@@@@@')
  // const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId

  const { monthYear }: { monthYear: string } = JSON.parse(event.body ?? '')

  try {
    const getDays = {
      Key: { user: "us-east-1:82ed093a-7dae-4f4a-9f13-5adc8472737a", month: monthYear },
      TableName: process.env.UserMonths ?? 'noTable'
    }
    console.log('getDayts', getDays)

    const dynamoData = await dynamoDb.get(getDays).promise()
    console.log("dynamoData", dynamoData)
    const map: Map<string, Record<string, Event>> = new Map(Object.entries(dynamoData.Item?.days))

    
    if (!dynamoData.Item) { return }

    return JSON.stringify(sort(map))

  } catch (err) {
    console.log('err', err)
    return { statusCode: 500 }
  }

  return

}





