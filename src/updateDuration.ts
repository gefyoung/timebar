import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda'
import { IAMAuthorizer } from '../lib/types'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventNameEvent {
  id: string,
  monthYear: string,
  dayKey: string,
  duration: number
}


export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  
  try {
    const { monthYear, dayKey, id, duration }: EventNameEvent = JSON.parse(event.body ?? '')
    
    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    console.log('id', id,monthYear, dayKey, duration)
    const updateMap = {
      ExpressionAttributeNames: { "#DA": "days", "#DK": dayKey, "#ST": id, "#DU": "duration" },
      ExpressionAttributeValues: { ":du": duration},
      Key: { userId: identityId, monthYear: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK.#ST.#DU = :du"
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
