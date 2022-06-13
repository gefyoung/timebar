import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyEventV2 } from 'aws-lambda'
import { IAMAuthorizer, Event } from './types'
const dynamoDb = new DynamoDB.DocumentClient()


export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  try {
    const {modifiedEvents, monthYear }: { modifiedEvents: Event[], monthYear: string}
     = JSON.parse(event.body ?? '')
    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    console.log('EE', modifiedEvents)

    

    for (const changedEvent of modifiedEvents) {

      if (changedEvent === modifiedEvents[0]) {
        const updateMap = {
          ExpressionAttributeNames: { 
            "#DA": "days", 
            "#DK": "" + changedEvent.dayKey, 
            "#ST": "" + changedEvent.start, 
            "#DU": "duration" 
          },
          ExpressionAttributeValues: { ":da": changedEvent.duration },
          Key: { user: identityId, month: monthYear },
          ReturnValues: "ALL_NEW",
          TableName: process.env.UserMonths ?? 'noTable',
          UpdateExpression: "SET #DA.#DK.#ST.#DU = :da"
        }
        
        await dynamoDb.update(updateMap).promise()
      } else {
        const eventObj = {
          duration: changedEvent.duration,
          eventName: changedEvent.eventName,
          eventNameKey: changedEvent.eventNameKey,
          text: changedEvent.text?? ""
        }

        const updateMap = {
          ExpressionAttributeNames: { 
            "#DA": "days", 
            "#DK": "" + changedEvent.dayKey, 
            "#ST": "" + changedEvent.start, 
            "#NS": "" + changedEvent.newStart
          },
          ExpressionAttributeValues: { ":eo": eventObj },
          Key: { user: identityId, month: monthYear },
          ReturnValues: "ALL_NEW",
          TableName: process.env.UserMonths ?? 'noTable',
          UpdateExpression: "REMOVE #DA.#DK.#ST SET #DA.#DK.#NS = :eo"
          /* remove has to be first in case the key is the same,
           it would just delete the overwritten */
        }
        console.log(updateMap, "ExpressionAttributeValues")
        
        await dynamoDb.update(updateMap).promise()
      }

    }

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
