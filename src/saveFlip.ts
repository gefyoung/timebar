import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

interface EditFlipEvent {
  dayKey: string
  start: string
  summary?: string
  text?: string
  dayText?: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const flipEvent: EditFlipEvent = JSON.parse(event.body ?? '')

    console.log('flipEvent', flipEvent)

    if (flipEvent.dayText) {
      const params = {
        ExpressionAttributeNames: { 
          "#DA": "days", 
          "#DI": "" + flipEvent.dayKey, 
          "#FI": "" + flipEvent.start
         },
        ExpressionAttributeValues: { ":ft": { text: flipEvent.dayText } },
        Key: { user: 'gty' },
        ReturnValues: "ALL_NEW",
        TableName: process.env.UserDays?? 'noTable',
        UpdateExpression: "SET #DA.#DI.#FI = :ft"
      }
      const updated = await dynamoDb.update(params).promise()
      console.log(updated, 'u[dated')
      return {
        statusCode: 200,
        body: JSON.stringify({ flipEvent: flipEvent })
      }


    } else if (flipEvent.text) {
      const params = {
        ExpressionAttributeNames: { 
          "#DA": "days", 
          "#DI": "" + flipEvent.dayKey, 
          "#FI": "" + flipEvent.start,
          "#TX": "text"
         },
        ExpressionAttributeValues: { ":ft": flipEvent.text },
        Key: { user: 'gty' },
        ReturnValues: "ALL_NEW",
        TableName: process.env.UserDays?? 'noTable',
        UpdateExpression: "SET #DA.#DI.#FI.#TX = :ft"
      }
      const updated = await dynamoDb.update(params).promise()
      console.log(updated, 'u[dated')
      return {
        statusCode: 200,
        body: JSON.stringify({ flipEvent: flipEvent })
      }


    } else {
      const params = {
        ExpressionAttributeNames: { 
          "#DA": "days", 
          "#DI": "" + flipEvent.dayKey, 
          "#FI": "" + flipEvent.start,
          "#FS": "summary"
         },
        ExpressionAttributeValues: { ":fs": flipEvent.summary },
        Key: { user: 'gty' },
        ReturnValues: "ALL_NEW",
        TableName: process.env.UserDays?? 'noTable',
        UpdateExpression: "SET #DA.#DI.#FI.#FS = :fs"
      }
      const updated = await dynamoDb.update(params).promise()
      console.log(updated, 'u[dated')
      return {
        statusCode: 200,
        body: JSON.stringify({ flipEvent: flipEvent })
      }
    }

    
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
