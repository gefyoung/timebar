import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda'
import { IAMAuthorizer } from './types'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventBody {
  eventName: string,
  monthYear: string,
  dayKey: string,
  start: number,
  duration: number,
  eventNameKey: number
}

interface EventObj {
  duration: number
  eventName: string
  eventNameKey: number
  text?: string
}

export const handler = async (event: 
  APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {

  try {
    const { eventName, monthYear, dayKey, eventNameKey, start, duration }: EventBody = JSON.parse(event.body ?? '')

    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId

    const updateMap = {
      ExpressionAttributeNames: { "#DA": "days", "#DK": dayKey, "#ST": "" + start },
      ExpressionAttributeValues: { ":en": { duration: duration, eventName: eventName, eventNameKey: eventNameKey } },
      Key: { user: identityId, month: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK.#ST = :en"
    }
    await dynamoDb.update(updateMap).promise()
    console.log('updated')
    return
  } catch (err) {

    console.log(err)
    return {
      statusCode: 500
    }
  }
}
