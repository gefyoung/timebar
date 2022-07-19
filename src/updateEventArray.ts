import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyEventV2 } from 'aws-lambda'
import { IAMAuthorizer, Event } from '../lib/types'
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
    } = JSON.parse(event.body ?? '')
    
    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    console.log('EE', modifiedEvents)
    console.log(event.body)

    /* convert edited array to whole new daymap */
    const arrToObj = modifiedEvents.reduce((acc, curr) => {
      return { ...acc, [curr.id]: {
        eventName: curr.eventName,
        eventNameKey: curr.eventNameKey,
        duration: curr.duration,
        text: curr.text,
        arrayIndex: curr.arrayIndex
      }}
    }, {})
    console.log('arrToObj', arrToObj)

    const updateMap = {
      ExpressionAttributeNames: { 
        "#DA": "days", 
        "#DK": "" + dayKey
      },
      ExpressionAttributeValues: { ":dv": arrToObj },
      Key: { userId: identityId, monthYear: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK = :dv"
    }
      const updateReturn = await dynamoDb.update(updateMap).promise()
    console.log('updateReturn', updateReturn.Attributes?.days[dayKey])

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