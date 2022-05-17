import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventNameEvent {
  start: number,
  monthYear: string,
  dayKey: string
}[]

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  
  try {
    const { monthYear, dayKey, start }: EventNameEvent = JSON.parse(event.body ?? '')
    
    console.log('delete event: ', monthYear, dayKey, start)

    const startWithNaN = start === null ? "NaN" : start
    
    const updateMap = {
      ExpressionAttributeNames: { "#DA": "days", "#DK": dayKey, "#ST": "" + startWithNaN },
      Key: { user: 'gty', month: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "REMOVE #DA.#DK.#ST"
    }
    const updatedRes = await dynamoDb.update(updateMap).promise()

      return {
        statusCode: 200,
        body: JSON.stringify(updatedRes)
      }
    
  } catch (err) {
    
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
