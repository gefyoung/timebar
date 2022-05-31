import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda'
import { IAMAuthorizer } from './types'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventNameEvent {
  start: number,
  monthYear: string,
  dayKey: string
}[]


export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  
  try {
    const { monthYear, dayKey, start }: EventNameEvent = JSON.parse(event.body ?? '')

    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    
    console.log('delete event: ', monthYear, dayKey, start)

    const startWithNaN = start === null ? "NaN" : start
    
    const updateMap = {
      ExpressionAttributeNames: { "#DA": "days", "#DK": dayKey, "#ST": "" + startWithNaN },
      Key: { user: identityId, month: monthYear },
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
