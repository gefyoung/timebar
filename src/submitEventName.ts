import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyEventV2 } from 'aws-lambda'
import { IAMAuthorizer } from '../lib/types'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventNameEvent {
  eventName: string,
  monthYear: string
}

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
  try {

    const { eventName, monthYear }: EventNameEvent = JSON.parse(event.body ?? '')

    const params = {
      ExpressionAttributeNames: { "#EV": "events" },
      ExpressionAttributeValues: { ":arr": [eventName] },
      Key: { userId: identityId, monthYear: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #EV = list_append(#EV, :arr)"
    }

    await dynamoDb.update(params).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ eventName: eventName })
    }

    
  } catch (err) {

    console.log(err)
    return {
      statusCode: 500
    }
  }
}
