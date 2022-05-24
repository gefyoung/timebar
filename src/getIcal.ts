import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import ical from 'node-ical'

const dynamoDb = new DynamoDB.DocumentClient()

interface FlipEvent {
  start?: number
  duration?: number
  summary?: string
  text?: string
}

type DateWithTimeZone = Date & { tz: string }

interface IcalResponse {
  type: string
  params: []
  dtstamp: DateWithTimeZone
  start: DateWithTimeZone
  datetype: string
  duration: string
  summary: string
  uid: string
  sequence: string
  method: string
  status: string
  end: DateWithTimeZone
}

type IcalMap = Map<string, IcalResponse>
type JsonMap = Map<string, Record<string, FlipEvent>>

// type Sorted = {
//   dayKey: string
//   dayValue: FlipEvent[]
//   dayText?: string
// }[]

function utcToLocal(utcDate: ical.DateWithTimeZone) {
  const start = new Date(utcDate.toLocaleString("en-US", { timeZone: 'America/Denver' }))
  return {
    start: "" + start.getTime(),
    dayBegins: "" + Date.parse(start.toDateString())
  }
}

function parseICAL(icalMap: IcalMap): JsonMap {

  const icalArray = Array.from(Object.values(icalMap))

  return icalArray.reduce((acc: JsonMap, cur: IcalResponse) => {

    const PTS = cur.duration.match(/PT(.+)S/)
    if (!PTS) { throw Error }

    const duration = Number(PTS[1]) * 1000

    if (!cur.start) { return acc }

    const { start, dayBegins } = utcToLocal(cur.start)

    if (!acc.get(dayBegins)) {
      acc.set(dayBegins, {})
    }

    if (!acc.get(dayBegins)?.[start]) {
      acc.get(dayBegins)![start] = {}
    }

    acc.get(dayBegins)![start] = {
      duration: duration,
      summary: cur.summary,
      start: Number(start)
    }

    return acc

  }, new Map())
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

export const handler: APIGatewayProxyHandlerV2 = async () => {
  console.log('hello')
  const fakeEvent = 'https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff'

  const getDays = {
    Key: { user: 'gty' },
    TableName: process.env.UserDays ?? 'noTable'
  }

  try {
    console.time('getTimeFlip')
    const ICALmap: IcalMap = await ical.async.fromURL(fakeEvent)
    console.timeEnd('getTimeFlip')

    const parsedICAL = parseICAL(ICALmap)
    let returnData = parsedICAL

    const userExists = await dynamoDb.get(getDays).promise()

    if (userExists.Item) {
      const dynamoDaysMap: Map<string, Record<string, FlipEvent>> = new Map(Object.entries(userExists.Item.days))

      /* if backend dates arent updated to todays date */
      const getToday = new Date(new Date().toLocaleString("en-US", { timeZone: 'America/Denver' }))
      const today = Date.parse(getToday.toDateString())
      let daysAdded = 0
      while (daysAdded < (86400000 * 30)) {
        const thatDay = Number(today) - daysAdded
        // console.log(thatDay, 'thatDay')
        daysAdded = daysAdded + 86400000
        // console.log(daysAdded, 'daysAdded')
        if (dynamoDaysMap.has("" + thatDay)
          || dynamoDaysMap.has(JSON.stringify(thatDay + 3600000))
          || dynamoDaysMap.has(JSON.stringify(thatDay - 3600000))) {
          // do nothing, if i return, i return the whole handler
        } else {
          const updateMap = {
            ExpressionAttributeNames: { "#DA": "days", "#DI": "" + thatDay },
            ExpressionAttributeValues: { ":fa": {} },
            Key: { user: 'gty' },
            ReturnValues: "ALL_NEW",
            TableName: process.env.UserDays ?? 'noTable',
            UpdateExpression: "SET #DA.#DI = :fa"
          }
          await dynamoDb.update(updateMap).promise()
        }

      }


      for (const [dayKeyPI, dayValuePI] of parsedICAL) {

        if (dynamoDaysMap.has(dayKeyPI)) {
          const dayRecord = dynamoDaysMap.get(dayKeyPI)
          if (!dayRecord) { return { statusCode: 500, err: "JS failure"} }

          const dynamoDay = new Map(Object.entries(dayRecord))

          for (const [feKeyPI, feValuePI] of Object.entries(dayValuePI)) {

            if (!dynamoDay.has(feKeyPI)) {
              const updateMap = {
                ExpressionAttributeNames: { "#DA": "days", "#DI": dayKeyPI, "#FI": feKeyPI },
                ExpressionAttributeValues: { ":fe": feValuePI },
                Key: { user: 'gty' },
                ReturnValues: "ALL_NEW",
                TableName: process.env.UserDays ?? 'noTable',
                UpdateExpression: "SET #DA.#DI.#FI = :fe"
              }
              const updatedRes = await dynamoDb.update(updateMap).promise()
              returnData = new Map(Object.entries(updatedRes.Attributes?.days))
              //this did fail, added new map entries
            } else {
              // console.log('has all days and flips')
              returnData = dynamoDaysMap
            }
          }

        } else {
          console.log('doesnt have dayKey')
          const updateMap = {
            ExpressionAttributeNames: { "#DA": "days", "#DI": dayKeyPI },
            ExpressionAttributeValues: { ":dm": dayValuePI },
            Key: { user: 'gty' },
            ReturnValues: "ALL_NEW",
            TableName: process.env.UserDays ?? 'noTable',
            UpdateExpression: "SET #DA.#DI = :dm"
          }
          const updatedRes = await dynamoDb.update(updateMap).promise()
          returnData = new Map(Object.entries(updatedRes.Attributes?.days))
        }
      }

    } else {
      console.log('!user doesnt exist')
      const newDbEntry = {
        Item: { user: 'gty', days: parsedICAL },
        TableName: process.env.UserDays ?? 'noTable'
      }
      await dynamoDb.put(newDbEntry).promise()
      returnData = parsedICAL
    }

    console.time('sorted')
    const sortedArray = sort(returnData)
    // console.log(sortedArray, 'sortedArray')
    const shit = JSON.stringify(sortedArray)
    
    console.timeEnd('sorted')
    return {
      statusCode: 200,
      // headers: { "Content-Type": "text/plain" },
      body: shit,
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      // headers: { "Content-Type": "text/plain" },
      // body: err
    }
  }
}

