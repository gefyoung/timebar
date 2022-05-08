import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventNameEvent {
  eventName: string,
  monthYear: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {

  try {

    const { eventName, monthYear }: EventNameEvent = JSON.parse(event.body ?? '')

    const params = {
      ExpressionAttributeNames: { "#EV": "events" },
      ExpressionAttributeValues: { ":arr": [eventName] },
      Key: { user: 'gty', month: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #EV = list_append(#EV, :arr)"
    }

    await dynamoDb.update(params).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ eventName: eventName })
    }


    
  } catch (err) {

    console.log(err)
    return {
      statusCode: 500
    }
  }
}
