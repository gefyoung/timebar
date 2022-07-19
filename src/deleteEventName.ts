import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda'
import { IAMAuthorizer } from '../lib/types'
const dynamoDb = new DynamoDB.DocumentClient()

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  
  try {
    
    const { eventNameArray, monthYear }: { 
      eventNameArray: string[], monthYear: string 
    } = JSON.parse(event.body ?? '')

    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    
    const params = {
      ExpressionAttributeNames: { "#EV": "events" },
      ExpressionAttributeValues: { ":arr": eventNameArray },
      Key: { userId: identityId, monthYear: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #EV = :arr"
    }

    const updatedRes = await dynamoDb.update(params).promise()

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
