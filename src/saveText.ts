import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyEventV2,Handler } from 'aws-lambda'
import { IAMAuthorizer } from '../lib/types'
const dynamoDb = new DynamoDB.DocumentClient()


interface EditFlipEvent {
  dayKey: number
  id: string
  text?: string
  monthYear?: string
  eventName?: string
}

// type APIGatewayProxyHandlerV2<T = never> = Handler<APIGatewayProxyEventV2, any>

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  try {
    const textData: EditFlipEvent = JSON.parse(event.body ?? '')
    console.log("FE", textData)
    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
    console.log('identityId', identityId, 'textdata', textData)
      const params = {
        ExpressionAttributeNames: {
          "#DA": "days",
          "#DI": "" + textData.dayKey,
          "#FI": "" + textData.id,
          "#TX": "text"
        },
        ExpressionAttributeValues: { ":ft": textData.text },
        Key: { userId: identityId, monthYear: textData.monthYear },
        ReturnValues: "ALL_NEW",
        TableName: process.env.UserMonths ?? 'noTable',
        UpdateExpression: "SET #DA.#DI.#FI.#TX = :ft"
      }

      const updated = await dynamoDb.update(params).promise()
      return {
        statusCode: 200,
        body: JSON.stringify({ flipEvent: textData })
      }
    // }

  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}

