import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda'
import { IAMAuthorizer } from '../lib/types'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventBody {
  eventName: string,
  monthYear: string,
  dayKey: string,
  eventKey: string,
  duration: number,
  eventNameKey: number
  id: string
  arrayIndex: number
}

export const handler = async (event: 
  APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {

  try {
    const { 
      eventName, 
      monthYear, 
      dayKey,
      eventNameKey, 
      id,
      duration,
      arrayIndex
    }: EventBody = JSON.parse(event.body ?? '')
    console.log(id)
    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId

    const updateMap = {
      ExpressionAttributeNames: { "#DA": "days", "#DK": dayKey, "#EK": "" + id },
      ExpressionAttributeValues: { ":en": { 
        duration: duration, 
        eventName: eventName, 
        eventNameKey: eventNameKey,
        arrayIndex: arrayIndex
      } },
      Key: { userId: identityId, monthYear: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK.#EK = :en"
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
