import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext, APIGatewayProxyEventV2,Handler } from 'aws-lambda'
import { IAMAuthorizer } from '../lib/types'
const dynamoDb = new DynamoDB.DocumentClient()


interface EditFlipEvent {
  dayKey: number
  start: number
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
    // if (textData.start === 0) {
    //   /* updating dayText overwrites 0 event properties cause text didn't prev exist on it */
    //   const params = {
    //     ExpressionAttributeNames: {
    //       "#DA": "days",
    //       "#DI": "" + textData.dayKey,
    //       "#ST": "0"
    //     },
    //     ExpressionAttributeValues: { ":ft": { text: "" + textData.text } },
    //     Key: { user: identityId, month: textData.monthYear },
    //     ReturnValues: "ALL_NEW",
    //     TableName: process.env.UserMonths ?? 'noTable',
    //     UpdateExpression: "SET #DA.#DI.#ST = :ft"
    //   }
    //   const updated = await dynamoDb.update(params).promise()
    //   console.log(updated)
    //   return {
    //     statusCode: 200,
    //     body: JSON.stringify({ flipEvent: textData })
    //   }


    // } else {
      /* updating eventText */
      const params = {
        ExpressionAttributeNames: {
          "#DA": "days",
          "#DI": "" + textData.dayKey,
          "#FI": "" + textData.start,
          "#TX": "text"
        },
        ExpressionAttributeValues: { ":ft": textData.text },
        Key: { user: identityId, month: textData.monthYear },
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

