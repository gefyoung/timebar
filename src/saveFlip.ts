import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const dayArray = JSON.parse(event.body ?? '')

    const params = {
      ExpressionAttributeNames: { "#DA": "days", "#DI": dayArray[0].dayBegins },
      ExpressionAttributeValues: { ":d": dayArray },
      Key: { user: 'gty' },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserDays?? 'noTable',
      UpdateExpression: "SET #DA.#DI = :d"
    }
    await dynamoDb.update(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify({ dayArray: dayArray }),
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
