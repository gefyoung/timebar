import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda'
import { IAMAuthorizer } from '../lib/types'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventBody {
  modifiedEvents: ChangedEvent[]
  dayKey: string
  monthYear: string
}

interface ChangedEvent {
  id: string,
  monthYear: string,
  dayKey: string,
  arrayIndex: number
}

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  
  try {
    const eventBody: EventBody = JSON.parse(event.body ?? '')
    
    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    console.log('changedEventsArray', eventBody)
    eventBody.modifiedEvents.forEach(async (changedEvent) => {
      const { monthYear, dayKey, id, arrayIndex } = changedEvent
      const updateMap = {
        ExpressionAttributeNames: { "#DA": "days", "#DK": dayKey, "#ST": id, "#AI": "arrayIndex" },
        ExpressionAttributeValues: { ":ai": arrayIndex },
        Key: { userId: identityId, monthYear: monthYear },
        ReturnValues: "ALL_NEW",
        TableName: process.env.UserMonths ?? 'noTable',
        UpdateExpression: "SET #DA.#DK.#ST.#AI = :ai"
      }

      await dynamoDb.update(updateMap).promise()

    })

      return 
      // {
      //   statusCode: 200,
      //   body: JSON.stringify(updatedRes)
      // }
    
  } catch (err) {
    
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
