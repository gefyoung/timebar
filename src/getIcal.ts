import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import ical from 'node-ical'

const dynamoDb = new DynamoDB.DocumentClient()

interface FlipEvent {
  // dayBegins?: number
  start?: number
  duration: number
  summary: string,
  text?: string
  // className: string
}


export const handler: APIGatewayProxyHandlerV2 = async () => {

  const fakeEvent = 'https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff'
  const userTZ = 'America/Denver'

  function sort(daysMap: Map<string, Map<string, FlipEvent> | FlipEvent[]>) {
    
    const arr = [...daysMap].map(([dayKey, dayValue]) => ({ dayKey, dayValue }))

    return arr.sort((dayA, dayB) => {
        if (!Array.isArray(dayA.dayValue)) {
            // dayA.dayText = Object.values(dayA.dayValue).map((flipEvent) => {
            //   if (flipEvent.start === 0) {
            //     return flipEvent.text
            //   }
            // })
            dayA.dayValue = Object.values(dayA.dayValue).sort((flipA, flipB) => {
                // if (!flipA.summary || !flipB.summary) {
                //   dayA.dayText = flipA.text || flipB.text
                // }
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

  type Sorted = {
      dayKey: string
      dayValue: FlipEvent[]
      dayText?: string
    }[]

  function flip0Day(sorted: Sorted
  ) {
    sorted.forEach((dayObj) => {
      if (!dayObj.dayValue[0].start) {
        dayObj.dayText = dayObj.dayValue[0].text
        dayObj.dayValue.splice(0, 1)
      }
    })
    console.log(sorted[0])
    return sorted
  }


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

      for (const [dayKey, dayValue] of Object.entries(parsedICAL)) {
        
        if (dynamoDaysMap.has(dayKey)) {
          const dynamoDay = new Map(Object.entries(dynamoDaysMap.get(dayKey)))

          if (Object.keys(dayKey).length !== Object.keys(dynamoDay).length) {
             for (const [feKey, feValue] of Object.entries(dayValue)) {
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
                const updatedRecord: Record<string, Map<string, FlipEvent>> = updatedRes.Attributes?.days
                returnData = new Map(Object.entries(updatedRes.Attributes?.days))
                //this did fail, added new map entries
              } else {
                returnData = dynamoDaysMap
              }
            }
          } else {
            returnData = dynamoDaysMap
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
          returnData =  new Map(Object.entries(updatedRes.Attributes?.days))
        }
      }

    } else {
      const newDbEntry = {
        Item: { user: 'gty', days: parsedICAL },
        TableName: process.env.UserDays?? 'noTable'
      }
      await dynamoDb.put(newDbEntry).promise()
      returnData = parsedICAL
    }

    console.time('sorted')
    console.log(Object.fromEntries(returnData))
    const sortedArray = sort(returnData)
    const zeroFlipConverted = flip0Day(sortedArray)
    // console.log(zeroFlipConverted)
    console.timeEnd('sorted')
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(zeroFlipConverted),
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

