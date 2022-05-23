import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

interface Event {
  dayKey: number
  start: number
  monthYear: string
  duration: number
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const eventEvent: Event = JSON.parse(event.body ?? '')
    const { dayKey, start, monthYear, duration } = eventEvent
    console.log('EE', eventEvent)

    const updateMap = {
      ExpressionAttributeNames: { 
        "#DA": "days", 
        "#DK": "" + dayKey, 
        "#ST": "" + start, 
        "#DU": "duration" 
      },
      ExpressionAttributeValues: { ":da": duration },
      Key: { user: 'gty', month: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK.#ST.#DU = :da"
    }
    
    await dynamoDb.update(updateMap).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ event: eventEvent })
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
