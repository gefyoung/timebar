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

export const handler: APIGatewayProxyHandlerV2 = async () => {

  const fakeEvent = 'https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff'
  const userTZ = 'America/Denver'

  function sortFlips(arr: FlipEvent[]) {
    return arr.sort((a: FlipEvent, b: FlipEvent) => {
      if (a.start < b.start) {
        return -1
      } else if (b.start < a.start) {
        return 1
      } else {
        return 0
      }
    })
  }


  function addDuration(sorted: FlipEvent[]) {
    const newEvents = []
    for (let i = 0; i < sorted.length - 1; i++) {
      sorted[i].duration = sorted[i + 1].start - sorted[i].start
      const unmodifiedDuration = sorted[i + 1].start - sorted[i].start
      if ((sorted[i].duration + sorted[i].start) > (sorted[i].dayBegins + 86400000)) {
        sorted[i].duration = (sorted[i].dayBegins + 86400000) - sorted[i].start
        const nextDayDuration = unmodifiedDuration - sorted[i].duration
        const newFlip = {
          dayBegins: sorted[i].dayBegins + 86400000,
          start: sorted[i].dayBegins + 86400000,
          duration: nextDayDuration,
          summary: sorted[i].summary,
        }
        newEvents.push({ i: i, newFlip: newFlip })
      }

    }
    newEvents.forEach((newFlip) => {
      sorted.splice(newFlip.i, 0, newFlip.newFlip)
    })
    return sorted
  }

  function sortDays(dayMap: Map<string, FlipEvent[]>) {
    return new Map([...dayMap].sort((dayKey1: [string, FlipEvent[]], dayKey2: [string, FlipEvent[]]) => {
      if (dayKey1 < dayKey2) {
        return -1
      } else if (dayKey2 < dayKey1) {
        return 1
      } else {
        return 0
      }
    }))
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

      if (!cur.start) { return acc }
      const { start, dayBegins } = utcToLocal(cur.start)

      if (!acc[dayBegins]) {
        acc[dayBegins] = {}
      }
      if (!acc[dayBegins][start]) {
        acc[dayBegins][start] = {}
      }
      acc[dayBegins][start] = {
        // dayBegins: dayBegins,
        // start: start,
        duration: PTS[1],
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
    const ICALmap = await ical.async.fromURL(fakeEvent)
    const parsedICAL: Map<string, Map<string, FlipEvent>> = parseICAL(ICALmap)

    const userExists = await dynamoDb.get(getDays).promise()

    if (userExists.Item) {
      const dynamoDaysMap: Map<string, Map<string, FlipEvent>> = new Map(Object.entries(userExists.Item.days))

      for (const [dayKey, dayValue] of Object.entries(parsedICAL)) {
        
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
                await dynamoDb.update(updateMap).promise()
              }
            }

            
            // Object.entries(dayKey).forEach(([feKey, feValue]) => {

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
          // const days: Record<string, FlipEvent[]> = updatedRes.Attributes?.days
          // const updatedMap = new Map(Object.entries(days))
          // mutatedData = sortDays(updatedMap)
        }
      }

      // const lastDayDynamo = getLastDayArr(mutatedData)
      // const lastMapDynamo = new Map(Object.entries(lastDayDynamo))
      // const lastDayIcal = getLastDayArr(new Map(Object.entries(groupedDays)))
      // const lastMapIcal = new Map(Object.entries(lastDayIcal))

      // const shitArray = Array.from(lastMapIcal)

      // for (const [key, value] of Object.entries(lastDayIcal)) {
      //   if (!lastMapDynamo.has(key)) {
      //     console.log('found new flip event key')
      //     console.log(value, 'value', key)

      //     const updateMap = {
      //       ExpressionAttributeNames: { "#DA": "days", "#DI": shitArray[0][1].dayBegins },
      //       ExpressionAttributeValues: { ":fe": value },
      //       Key: { user: 'gty' },
      //       ReturnValues: "ALL_NEW",
      //       TableName: process.env.UserDays?? 'noTable',
      //       UpdateExpression: "SET #DA.#DI = list_append(#DA.#DI, :fe)"
      //     }
      //     const updatedRes = await dynamoDb.update(updateMap).promise()
      //     console.log(updatedRes, 'updatedDay res')
      //   }
      // }

    } 
    else {
      const newDbEntry = {
        Item: { user: 'gty', days: parsedICAL },
        TableName: process.env.UserDays?? 'noTable'
      }
  
      // mutatedData = parsedICAL
      await dynamoDb.put(newDbEntry).promise()
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ shit: 'shit' }),
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

