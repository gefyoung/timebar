import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import ical from 'node-ical'
const dynamoDb = new DynamoDB.DocumentClient()

interface FlipEvent {
  dayBegins?: number
  start: number
  duration: number
  summary: string
  className: string
  text?: string
}
interface Day {
  dayKey: string
  dayValue: FlipEvent[]
  dayText?: string
}


export const handler: APIGatewayProxyHandlerV2 = async () => {
  const date = new Date()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const monthsKey = month + "_" + year
  const day = date.getDate()

  try {
    const getDays = {
      Key: { user: 'gty', month: monthsKey },
      TableName: process.env.UserMonths ?? 'noTable'
    }

    let returnData

    const dynamoData = await dynamoDb.get(getDays).promise()

    const map: Map<string, Record<string, FlipEvent>> = new Map(Object.entries(dynamoData.Item?.days))

    returnData = { 
      user: 'gty', 
      month: monthsKey, 
      days: sort(map)
    }

    /* if user does not exist */
    if (Object.keys(dynamoData).length === 0) {

      const newUser = {
        Item: { user: 'gty', month: monthsKey, days: { [day]: {} } },
        TableName: process.env.UserMonths ?? 'noTable'
      }
      await dynamoDb.put(newUser).promise()

      returnData = { 
        user: 'gty', 
        month: monthsKey, 
        days: [{ 
          dayKey: "" + day,
          dayValue: []
        }]
      }

    }

    console.log('returnData', returnData)
    return { statusCode: 200, body: JSON.stringify(returnData) }

  } catch (err) {
    console.log('err', err)
    return { statusCode: 500 }
  }

}





function sort(daysMap: Map<string, Record<string, FlipEvent>>) {

  const arr = [...daysMap].map(([dayKey, dayValue]) => {
    const returnObj: {
      dayKey: string
      dayValue: FlipEvent[]
      dayText?: string
    } = {
      dayKey: '',
      dayValue: [],
    }

    const dayArray = Array.from(Object.entries(dayValue)).map(([flipKey, flipValue]) => {
      if (Number(flipKey) === 0) {
        returnObj.dayText = flipValue.text
      }
      return {
        ...flipValue,
        start: Number(flipKey)
      }
    })
    /* if the flip Obj doesnt have duration, ie, dayText, get rid of it */
    const no0dayArray = dayArray.filter((flipObj) => {
      return flipObj.duration
    })

    returnObj.dayKey = dayKey
    returnObj.dayValue = no0dayArray
    return returnObj
  })

  return arr.sort((dayA, dayB) => {
    dayA.dayValue = Object.values(dayA.dayValue).sort((flipA, flipB) => {
      if (Number(flipA.start) < Number(flipB.start)) {
        return -1
      } else if (Number(flipB.start) < Number(flipA.start)) {
        return 1
      } else {
        return 0
      }
    })

    dayB.dayValue = Object.values(dayB.dayValue).sort((flipA, flipB) => {
      if (Number(flipA.start) < Number(flipB.start)) {
        return -1
      } else if (Number(flipB.start) < Number(flipA.start)) {
        return 1
      } else {
        return 0
      }
    })

    if (Number(dayA.dayKey) < Number(dayB.dayKey)) {
      return 1
    } else if (Number(dayB.dayKey) < Number(dayA.dayKey)) {
      return -1
    } else {
      return 0
    }
  })
}