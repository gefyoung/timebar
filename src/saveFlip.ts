import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const flipEvent = JSON.parse(event.body ?? '')

    const flipId = flipEvent.flipId
    // const { startTime, duration, summary, className } = eventBody

    // const identityId = event.requestContext.authorizer?.iam?.cognitoIdentity.identityId
    const params = {
      ExpressionAttributeNames: { "#DA": "days", "#FI": flipId },
      ExpressionAttributeValues: { ":f": flipEvent },
      Key: { user: 'gty' },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UsersDays?? '',
      UpdateExpression: "SET #DA.#FI = :f"
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
