import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import ical from 'node-ical'

const dynamoDb = new DynamoDB.DocumentClient()

interface FlipEvent {
  dayBegins?: number
  start?: number
  duration: number
  summary: string,
  // className: string
}
type DaysMap = Map<string, Map<string, FlipEvent>>
type DayArray = [string, Map<string, FlipEvent>]
// type FlipArray = [string, FlipEvent]
interface FlipArray {
  dayKey: string
  dayValue: FlipEvent
}


export const handler: APIGatewayProxyHandlerV2 = async () => {

  const fakeEvent = 'https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff'
  const userTZ = 'America/Denver'

  function sort(daysMap: Map<string, Map<string, FlipEvent> | FlipEvent[]>) {
    const arr = [...new Map(Object.entries(daysMap))].map(([dayKey, dayValue]) => ({ dayKey, dayValue }))
    return arr.sort((dayA, dayB) => {

        if (!Array.isArray(dayA.dayValue)) {
            dayA.dayValue = Object.values(dayA.dayValue).sort((flipA, flipB) => {
                if (Number(flipA.start) < Number(flipB.start)) {
                    return -1
                } else if (Number(flipB.start) < Number(flipA.start)) {
                    return 1
                } else {
                    return 0
                }
            })
        }
        if (!Array.isArray(dayB.dayValue)) {
            dayB.dayValue = Object.values(dayB.dayValue).sort((flipA, flipB) => {
                if (Number(flipA.start) < Number(flipB.start)) {
                    return -1
                } else if (Number(flipB.start) < Number(flipA.start)) {
                    return 1
                } else {
                    return 0
                }
            })
        }

        if (Number(dayA.dayKey) < Number(dayB.dayKey)) {
            return 1
        } else if (Number(dayB.dayKey) < Number(dayA.dayKey)) {
            return -1
        } else {
            return 0
        }

    })
}

  // function sortFlips(dayArr: DayArray) {
  //  return dayArr.map(([dayKey, dayValue]) => {
  //     return {[dayKey]: Object.values(dayValue).sort((a: FlipEvent, b: FlipEvent) => {
  //       const flipA = Number(a.start)
  //       const flipB = Number(b.start)
  //       // console.log(flipA, '& ', flipB, 'a,b')
  //       if (flipA < flipB) {
  //         return -1
  //       } else if (flipB < flipA) {
  //         return 1
  //       } else {
  //         return 0
  //       }
  //     })
  //   }
  //   })
  // }

  // function sortDays(dayMap: DaysMap): [string, FlipEvent][] {
  //   console.log(dayMap, 'daysMap')
  //   return Object.entries(dayMap).sort((dayA: DayArray, dayB: DayArray) => {
  //     const dayAst = Number(dayA[0])
  //     const dayBst = Number(dayB[0])
  //     if (dayAst < dayBst) {
  //       return 1
  //     } else if (dayBst < dayAst) {
  //       return -1
  //     } else {
  //       return 0
  //     }
  //   })
  // }

  function utcToLocal(utcDate: ical.DateWithTimeZone) {
    const start = new Date(utcDate.toLocaleString("en-US", { timeZone: userTZ }))
    return {
      start: start.getTime(),
      dayBegins: Date.parse(start.toDateString())
    }
  }

  function parseICAL(icalMap: ical.CalendarResponse) { // i still need to add the split event

    const icalArray = Array.from(Object.values(icalMap))
    
    return icalArray.reduce((acc: any, cur, i) => {
      const PTS = cur.duration.match(/PT(.+)S/)
      const duration = Number(PTS[1]) * 1000

      if (!cur.start) { return acc }
      const { start, dayBegins } = utcToLocal(cur.start)

      if (!acc[dayBegins]) {
        acc[dayBegins] = {}
      }
      if (!acc[dayBegins][start]) {
        acc[dayBegins][start] = {}
      }

      if (start + duration > dayBegins + 86400000) {
        console.log('found an event lasting longer than day, start + duration', start, '%', duration, 'day ends', dayBegins + 86400000)
      }
      acc[dayBegins][start] = {
        // dayBegins: dayBegins,
        start: start,
        duration: duration,
        summary: cur.summary,
      }

      return acc
    }, {})
  }

  const getDays = {
      Key: { user: 'gty' },
      TableName: process.env.UserDays?? 'noTable'
    }

  try {
    console.time('getTimeFlip')
    const ICALmap = await ical.async.fromURL(fakeEvent)
    const parsedICAL: Map<string, Map<string, FlipEvent>> = parseICAL(ICALmap)
    let returnData = parsedICAL
    console.timeEnd('getTimeFlip')
    const userExists = await dynamoDb.get(getDays).promise()

    if (userExists.Item) {
      const dynamoDaysMap: Map<string, Map<string, FlipEvent>> = new Map(Object.entries(userExists.Item.days))

      for await (const [dayKey, dayValue] of Object.entries(parsedICAL)) {
        
        if (dynamoDaysMap.has(dayKey)) {
          const dynamoDay = new Map(Object.entries(dynamoDaysMap.get(dayKey)))

          if (Object.keys(dayKey).length !== Object.keys(dynamoDay).length) {
             for await (const [feKey, feValue] of Object.entries(dayValue)) {
              if (!dynamoDay.has(feKey)) {
                const updateMap = {
                  ExpressionAttributeNames: { "#DA": "days", "#DI": dayKey, "#FI": feKey },
                  ExpressionAttributeValues: { ":fe": feValue },
                  Key: { user: 'gty' },
                  ReturnValues: "ALL_NEW",
                  TableName: process.env.UserDays?? 'noTable',
                  UpdateExpression: "SET #DA.#DI.#FI = :fe"
                }
                const updatedRes = await dynamoDb.update(updateMap).promise()
                returnData = updatedRes.Attributes?.days
              }
            }
          }
          
        } else {
          const updateMap = {
            ExpressionAttributeNames: { "#DA": "days", "#DI": dayKey },
            ExpressionAttributeValues: { ":dm": dayValue },
            Key: { user: 'gty' },
            ReturnValues: "ALL_NEW",
            TableName: process.env.UserDays?? 'noTable',
            UpdateExpression: "SET #DA.#DI = :dm"
          }
          const updatedRes = await dynamoDb.update(updateMap).promise()
          returnData = updatedRes.Attributes?.days
        }
      }

    } else {
      const newDbEntry = {
        Item: { user: 'gty', days: parsedICAL },
        TableName: process.env.UserDays?? 'noTable'
      }
      await dynamoDb.put(newDbEntry).promise()
    }
    console.time('sorted')
    // const sortedDays = sortDays(returnData)
    // const sorted = sortFlips(sortedDays)
    const sortedArray = sort(returnData)
    console.timeEnd('sorted')

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(sortedArray),
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      error: err
    }
  }
}

