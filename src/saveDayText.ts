import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

interface EditFlipEvent {
  dayKey: number
  start: number
  summary?: string
  text?: string
  dayText?: string,
  monthYear?: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const flipEvent: EditFlipEvent = JSON.parse(event.body ?? '')
    console.log("FE", flipEvent)

      const params = {
        ExpressionAttributeNames: { 
          "#DA": "days", 
          "#DI": "" + flipEvent.dayKey, 
          "#FI": "" + flipEvent.start
         },
        ExpressionAttributeValues: { ":ft": { text: flipEvent.dayText } },
        Key: { user: 'gty', month: flipEvent.monthYear },
        ReturnValues: "ALL_NEW",
        TableName: process.env.UserMonths?? 'noTable',
        UpdateExpression: "SET #DA.#DI.#FI = :ft"
      }

      const updated = await dynamoDb.update(params).promise()
      return {
        statusCode: 200,
        body: JSON.stringify({ flipEvent: flipEvent })
      }
    
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
