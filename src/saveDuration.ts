import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyEventV2 } from 'aws-lambda'
import { IAMAuthorizer } from './types'
const dynamoDb = new DynamoDB.DocumentClient()

interface Event {
  dayKey: number
  start: number
  monthYear: string
  duration: number
}

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  try {
    const eventEvent: Event = JSON.parse(event.body ?? '')
    const { dayKey, start, monthYear, duration } = eventEvent
    console.log('EE', eventEvent)
    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    const updateMap = {
      ExpressionAttributeNames: { 
        "#DA": "days", 
        "#DK": "" + dayKey, 
        "#ST": "" + start, 
        "#DU": "duration" 
      },
      ExpressionAttributeValues: { ":da": duration },
      Key: { user: identityId, month: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK.#ST.#DU = :da"
    }
    
    await dynamoDb.update(updateMap).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ event: eventEvent })
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
