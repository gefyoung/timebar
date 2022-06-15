import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyEventV2 } from 'aws-lambda'
import { IAMAuthorizer, Event } from './types'
const dynamoDb = new DynamoDB.DocumentClient()


export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  try {
    const {
      modifiedEvents, 
      monthYear, 
      dayKey
     }: { 
      modifiedEvents: Event[], 
      monthYear: string,
      dayKey : string
  }
     = JSON.parse(event.body ?? '')
    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    console.log('EE', modifiedEvents)
    console.log(event.body)

    /* convert edited array to whole new daymap */
    const arrToObj = modifiedEvents.reduce((acc, curr) => {
      return { ...acc, [curr.start]: {
        eventName: curr.eventName,
        eventNameKey: curr.eventNameKey,
        duration: curr.duration
      }}
    }, {})

    const updateMap = {
      ExpressionAttributeNames: { 
        "#DA": "days", 
        "#DK": "" + dayKey
      },
      ExpressionAttributeValues: { ":dv": arrToObj },
      Key: { user: identityId, month: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK = :dv"
    }
      await dynamoDb.update(updateMap).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ event: modifiedEvents })
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}