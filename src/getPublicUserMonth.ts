import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import { Day, Event } from '../lib/types'
import sort from '../lib/sort'
import { IAMAuthorizer } from '../lib/types'

const dynamoDb = new DynamoDB.DocumentClient()

export const handler = async (event: any) => {

  const { monthYear }: { monthYear: string } = JSON.parse(event.body ?? '')

  const identity = process.env.STAGE === "prod" 
    ? "us-east-1:b815ff91-0423-41dd-bbbb-8fe18b28badd"
    : "us-east-1:82ed093a-7dae-4f4a-9f13-5adc8472737a"
  
  try {
    const getDays = {
      Key: { user: identity, month: monthYear },
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





