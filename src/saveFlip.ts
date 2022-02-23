import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

interface EditFlipEvent {
  dayBegins: string
  start: string
  summary: string
  text: string
  duration: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const flipEvent: EditFlipEvent = JSON.parse(event.body ?? '')
    console.log('flipEvent', flipEvent)

    const flipValues = {
      summary: flipEvent.summary,
      duration: flipEvent.duration,
      text: flipEvent.text
    }

    const params = {
      ExpressionAttributeNames: { "#DA": "days", "#DI": flipEvent.dayBegins, "#FI": flipEvent.start },
      ExpressionAttributeValues: { ":fv": flipValues },
      Key: { user: 'gty' },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserDays?? 'noTable',
      UpdateExpression: "SET #DA.#DI.#FI = :fv"
    }
    await dynamoDb.update(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify({ flipEvent: flipEvent }),
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
