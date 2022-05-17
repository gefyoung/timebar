import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

interface EditFlipEvent {
  dayKey: number
  start: number
  text?: string
  monthYear?: string
  eventName?: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const textData: EditFlipEvent = JSON.parse(event.body ?? '')
    console.log("FE", textData)

    if (textData.start === 0) {
      /* updating dayText overwrites 0 event properties cause text didn't prev exist on it */
      const params = {
        ExpressionAttributeNames: {
          "#DA": "days",
          "#DI": "" + textData.dayKey,
          "#FI": "" + textData.start
        },
        ExpressionAttributeValues: { ":ft": { text: "" + textData.text } },
        Key: { user: 'gty', month: textData.monthYear },
        ReturnValues: "ALL_NEW",
        TableName: process.env.UserMonths ?? 'noTable',
        UpdateExpression: "SET #DA.#DI.#FI = :ft"
      }
      const updated = await dynamoDb.update(params).promise()
      console.log(updated)
      return {
        statusCode: 200,
        body: JSON.stringify({ flipEvent: textData })
      }


    } else {
      /* updating eventText */
      const params = {
        ExpressionAttributeNames: {
          "#DA": "days",
          "#DI": "" + textData.dayKey,
          "#FI": "" + textData.start,
          "#TX": "text"
        },
        ExpressionAttributeValues: { ":ft": textData.text },
        Key: { user: 'gty', month: textData.monthYear },
        ReturnValues: "ALL_NEW",
        TableName: process.env.UserMonths ?? 'noTable',
        UpdateExpression: "SET #DA.#DI.#FI.#TX = :ft"
      }

      const updated = await dynamoDb.update(params).promise()
      return {
        statusCode: 200,
        body: JSON.stringify({ flipEvent: textData })
      }
    }





  } catch (err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}
