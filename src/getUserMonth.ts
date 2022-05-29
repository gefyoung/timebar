import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import { FlipEvent } from '../lib/types'
import sort from '../lib/sort'
import { IAMAuthorizer } from './types'

const dynamoDb = new DynamoDB.DocumentClient()

interface TimezoneOffset {
  timezoneOffset: number
}

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {

  const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId

  const { timezoneOffset }: TimezoneOffset = JSON.parse(event.body ?? '')
  const offsetMilliseconds = timezoneOffset * 60000
  const date = new Date()
  const offsetDate = new Date(date.getTime() - offsetMilliseconds)
  const month = offsetDate.getMonth() + 1
  const year = offsetDate.getFullYear()
  const monthsKey = month + "_" + year
  const day = "" + offsetDate.getDate()

  console.log('date: ', date, ', offsetDate: ', offsetDate)

  // const prevMonthYear = // i need to import the previous Event Names

  try {
    const getDays = {
      Key: { user: identityId, month: monthsKey },
      TableName: process.env.UserMonths ?? 'noTable'
    }

    let returnData

    const dynamoData = await dynamoDb.get(getDays).promise()

    /* if user does not exist */
    if (Object.keys(dynamoData).length === 0) {

      const newUser = {
        Item: { user: identityId, month: monthsKey, days: { [day]: {} }, events: [] },
        TableName: process.env.UserMonths ?? 'noTable'
      }
      await dynamoDb.put(newUser).promise()

      returnData = {
        user: identityId,
        month: monthsKey,
        days: [{
          dayKey: day,
          dayValue: []
        }]
      }

    
    /* if user exists */
    } else {

      let map: Map<string, Record<string, FlipEvent>> = new Map(Object.entries(dynamoData.Item?.days))

      /* if user doesn't have today */
      if (!map.has(day)) {
        const updateMap = {
          ExpressionAttributeNames: { "#DA": "days", "#DI": day },
          ExpressionAttributeValues: { ":fa": {} },
          Key: { user: identityId, month: monthsKey },
          ReturnValues: "ALL_NEW",
          TableName: process.env.UserMonths ?? 'noTable',
          UpdateExpression: "SET #DA.#DI = :fa"
        }
        const updatedRes = await dynamoDb.update(updateMap).promise()
        map = new Map(Object.entries(updatedRes.Attributes?.days))
      }

      /* if user doesn't have any eventNames saved */
      const eventArray = dynamoData.Item?.events
      if (!eventArray) {
        const updateArray = {
          ExpressionAttributeNames: { "#EV": "events" },
          ExpressionAttributeValues: { ":ev": [] },
          Key: { user: identityId, month: monthsKey },
          ReturnValues: "ALL_NEW",
          TableName: process.env.UserMonths ?? 'noTable',
          UpdateExpression: "SET #EV = :ev"
        }
        const updatedArray = await dynamoDb.update(updateArray).promise()
        console.log('updatedArray', updatedArray)
      }
     

      returnData = {
        user: identityId,
        month: monthsKey,
        days: sort(map),
        events: eventArray
      }
    }


    return { statusCode: 200, body: JSON.stringify(returnData) }


  } catch (err) {
    console.log('err', err)
    return { statusCode: 500 }
  }

}





