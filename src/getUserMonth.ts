import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2WithRequestContext } from "aws-lambda"
import { Day, Event } from '../lib/types'
import sort from '../lib/sort'
import { IAMAuthorizer } from '../lib/types'

const dynamoDb = new DynamoDB.DocumentClient()

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {

  const identityId = event.requestContext.authorizer.iam.cognitoIdentity.identityId

  const { timezoneOffset, monthYear }: {
    timezoneOffset: number, 
    monthYear: string
  } = JSON.parse(event.body ?? '')

  const offsetMilliseconds = timezoneOffset * 60000
  const date = new Date()
  const offsetDate = new Date(date.getTime() - offsetMilliseconds)
  // const month = offsetDate.getMonth() + 1
  const year = offsetDate.getFullYear()
  // const monthsKey = monthYear
  /* prevMonthYear is for getting eventNameArray */
  const prevMonthYear = offsetDate.getMonth() 
    /* if current month is jan, month = 0 */
    ? offsetDate.getMonth() + "_" + year 
    : "12_" + (year - 1)
  const day = "" + offsetDate.getDate()

  try {
    const getDays = {
      Key: { userId: identityId, monthYear: monthYear },
      TableName: process.env.UserMonths ?? 'noTable'
    }
    const prevDays = {
      Key: { userId: identityId, monthYear: prevMonthYear },
      TableName: process.env.UserMonths ?? 'noTable'
    }

    let returnData

    const dynamoData = await dynamoDb.get(getDays).promise()
    const prevMonth = dynamoDb.get(prevDays).promise()
    /* if user does not exist */
    if (Object.keys(dynamoData).length === 0) {

      const newUser = {
        Item: { userId: identityId, monthYear: monthYear, days: { [day]: {} }, events: [] },
        TableName: process.env.UserMonths ?? 'noTable'
      }
      await dynamoDb.put(newUser).promise()

      returnData = {
        user: identityId,
        month: monthYear,
        days: [{
          dayKey: day,
          dayValue: []
        }]
      }

    /* if user exists */
    } else {

      // const newDays: Event[] = []
      // dynamoData.Item?.days.forEach((day) => {

      // })
      // for (const [key, value] of Object.entries(dynamoData.Item?.days)) {
      //   newDays.push
      // }
      // Object.entries(dynamoData.Item?.days).forEach(([key, value]) => {
        
      // })
      let map: Map<string, Record<string, Event>> = new Map(Object.entries(dynamoData.Item?.days))

      /* if user doesn't have today */
      if (!map.has(day)) {
        const updateMap = {
          ExpressionAttributeNames: { "#DA": "days", "#DI": day },
          ExpressionAttributeValues: { ":fa": {} },
          Key: { userId: identityId, monthYear: monthYear },
          ReturnValues: "ALL_NEW",
          TableName: process.env.UserMonths ?? 'noTable',
          UpdateExpression: "SET #DA.#DI = :fa"
        }
        const updatedRes = await dynamoDb.update(updateMap).promise()
        map = new Map(Object.entries(updatedRes.Attributes?.days))

      }
      
      // Array.from(map, (key, value) => {console.log('keyVALUAE', key, value)})
      
      // map.forEach((day) => {
      //   let eventsArray: Event[] = []
      //   day.dayValue.forEach((event) => {

      //   })
        
      // })

      /* if user doesn't have any eventNames saved */
      const prevMonthArray = await prevMonth 
      const eventArray = dynamoData.Item?.events
      const prevEvents = prevMonthArray.Item?.events
      console.log(eventArray.length, 'eventArray')
      if (eventArray.length === 0 && prevEvents) {
        const updateArray = {
          ExpressionAttributeNames: { "#EV": "events" },
          ExpressionAttributeValues: { ":ev": prevEvents },
          Key: { userId: identityId, monthYear: monthYear },
          ReturnValues: "ALL_NEW",
          TableName: process.env.UserMonths ?? 'noTable',
          UpdateExpression: "SET #EV = :ev"
        }
        const updatedArray = await dynamoDb.update(updateArray).promise()
        console.log('updatedArray', updatedArray)
      }
      
      returnData = {
        user: identityId,
        month: monthYear,
        days: sort(map),
        events: eventArray.length === 0 ? prevEvents : eventArray
      }
    }


    return { statusCode: 200, body: JSON.stringify(returnData) }


  } catch (err) {
    console.log('err', err)
    return { statusCode: 500 }
  }

}





