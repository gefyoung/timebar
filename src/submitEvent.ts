import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda'
import { IAMAuthorizer } from './types'
const dynamoDb = new DynamoDB.DocumentClient()

interface EventBody {
  eventName: string,
  monthYear: string,
  dayKey: string,
  start: number,
  duration: number,
  eventNameKey: number
}

interface EventObj {
  duration: number
  eventName: string
  eventNameKey: number
  text?: string
}

export const handler = async (event: 
  APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {

  try {
    const { eventName, monthYear, dayKey, eventNameKey, start, duration }: EventBody = JSON.parse(event.body ?? '')

    const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId


    // const getDays = {
    //   Key: { user: identityId, month: monthYear },
    //   TableName: process.env.UserMonths ?? 'noTable',
    //   ProjectExpression: "days"
    // }

    // const dynamoDay = await dynamoDb.get(getDays).promise()

    // const day: Record<string, EventObj> = dynamoDay.Item?.days[dayKey]

    // let newStart
    // console.log("OBJECT KEYS", Object.keys(day))
    // if (Object.keys(day).length === 0) {
    //   newStart = 1
    // } else {
    //   const max = Object.keys(day).reduce((prev, cur) =>
    //     cur === "NaN" ? prev :
    //       parseInt(prev) > parseInt(cur) ? prev : cur
    //   )
    //   if (max === "NaN") {
    //     return {
    //       statusCode: 500
    //     }
    //   }
    //   const lastEvent = day["" + max]
    //   newStart = lastEvent.duration + Number(max)
    // }

    


    const updateMap = {
      ExpressionAttributeNames: { "#DA": "days", "#DK": dayKey, "#ST": "" + start },
      ExpressionAttributeValues: { ":en": { duration: duration, eventName: eventName, eventNameKey: eventNameKey } },
      Key: { user: identityId, month: monthYear },
      ReturnValues: "ALL_NEW",
      TableName: process.env.UserMonths ?? 'noTable',
      UpdateExpression: "SET #DA.#DK.#ST = :en"
    }
    await dynamoDb.update(updateMap).promise()
    console.log('updated')
    // const res = {
    //   eventName: eventName,
    //   monthYear: monthYear,
    //   dayKey: dayKey,
    //   start: start,
    //   eventNameKey: eventNameKey,
    //   duration: duration
    // }

    return {
      // statusCode: 200,
      // body: JSON.stringify(res)
    }

  } catch (err) {

    console.log(err)
    return {
      statusCode: 500
    }
  }
}
