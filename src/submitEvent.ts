import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventNameEvent {
  eventName: string,
  monthYear: string,
  dayKey: string,
  start: number,
  duration: number,
  eventKey: number
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  
  try {
    const { eventName, monthYear, dayKey, start, eventKey }: EventNameEvent = JSON.parse(event.body ?? '')
    
    console.log(eventName, monthYear, dayKey, start)
    
    const updateMap = {
      ExpressionAttributeNames: { "#DA": "days", "#DK": dayKey, "#ST": "" + start },
      ExpressionAttributeValues: { ":en": { duration: 6, eventName: eventName, eventKey: eventKey } },
      Key: { user: 'gty', month: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK.#ST = :en"
    }
    const updatedRes = await dynamoDb.update(updateMap).promise()
    console.log(updatedRes)
    const res = {
      eventName: eventName, 
      monthYear: monthYear, 
      dayKey: dayKey,
      start: start, 
      eventKey: eventKey
    }

      return {
        statusCode: 200,
        body: JSON.stringify(res)
      }
    
  } catch (err) {
    
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
