import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import ical from 'node-ical'
const dynamoDb = new DynamoDB.DocumentClient()

interface FlipEvent {
  dayBegins: number
  start: number
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


  function addDuration(sorted: FlipEvent[]){
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
        newEvents.push({i: i, newFlip: newFlip})
      }

    }
    newEvents.forEach((newFlip) => {
      sorted.splice(newFlip.i, 0, newFlip.newFlip)
    })
    return sorted
  }

  function groupByDays(objectArray: FlipEvent[]) {
    return objectArray.reduce<Record<string, FlipEvent[]>>((acc, cur) => {
      const key = cur.dayBegins
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(cur)
      return acc
    }, {})
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
  

  try {
    const parsedICAL = await ical.async.fromURL(fakeEvent)

    const eventArray: any[] = []

    for (const calEvent of Object.values(parsedICAL)) {

      if (calEvent.start instanceof Date) {
        const utcDate = new Date(calEvent.start)
        const convertedTZ = utcDate.toLocaleString("en-US", { timeZone: userTZ })
        const convertedDate = new Date(convertedTZ)
        const startTime = convertedDate.getTime()

        const dayBegins = Date.parse(convertedDate.toDateString())

        const newShit = {
          dayBegins: dayBegins,
          start: startTime,
          duration: null,
          summary: calEvent.summary,
        }
        eventArray.push(newShit)
      }
    }
    const sorted = sortFlips(eventArray)
    const withDuration = addDuration(sorted)
    const groupedDays = groupByDays(withDuration)

    const getDays = {
      Key: { user: 'gty' },
      TableName: process.env.UserDays?? 'noTable'
    }

    const newDbEntry = {
      Item: {
        user: 'gty',
        days: groupedDays
      },
      TableName: process.env.UserDays?? 'noTable'
    }

    const userExists = await dynamoDb.get(getDays).promise()

    let mutatedData: Map<string, FlipEvent[]> | null = null

    if (userExists.Item) {
      const newMap: Map<string, FlipEvent[]> = new Map(Object.entries(userExists.Item.days))

      for (const [key, value] of Object.entries(groupedDays)) {
        if (!newMap.has(key)) {
          console.log('found new day key')
          const updateMap = {
            ExpressionAttributeNames: { "#DA": "days", "#ID": key },
            ExpressionAttributeValues: { ":dm": value },
            Key: { user: 'gty' },
            ReturnValues: "ALL_NEW",
            TableName: process.env.UserDays?? 'noTable',
            UpdateExpression: "SET #DA.#ID = :dm"
          }
          const updatedRes = await dynamoDb.update(updateMap).promise()
          const days: Record<string, FlipEvent[]> = updatedRes.Attributes?.days
          const updatedMap = new Map(Object.entries(days))
          mutatedData = sortDays(updatedMap)
        } else {
          mutatedData = sortDays(newMap)
        }
      }

      /* might be able to have unfinished days never update */
      const getLastDayArr = (map: Map<string, FlipEvent[]>) => {
        const lastDayArr = Array.from(map)[map.size-1][1]
        return lastDayArr.reduce((feMap, feObj) => {
          feMap[feObj.start] = feObj
          return feMap
        }, {})
      }

      const lastDayDynamo = getLastDayArr(mutatedData)
      const lastMapDynamo = new Map(Object.entries(lastDayDynamo))
      const lastDayIcal = getLastDayArr(new Map(Object.entries(groupedDays)))
      const lastMapIcal = new Map(Object.entries(lastDayIcal))

      const shitArray = Array.from(lastMapIcal)

      for (const [key, value] of Object.entries(lastDayIcal)) {
        if (!lastMapDynamo.has(key)) {
          console.log('found new flip event key')
          console.log(value, 'value', key)

          const updateMap = {
            ExpressionAttributeNames: { "#DA": "days", "#DI": shitArray[0][1].dayBegins },
            ExpressionAttributeValues: { ":fe": value },
            Key: { user: 'gty' },
            ReturnValues: "ALL_NEW",
            TableName: process.env.UserDays?? 'noTable',
            UpdateExpression: "SET #DA.#DI = list_append(#DA.#DI, :fe)"
          }
          const updatedRes = await dynamoDb.update(updateMap).promise()
          console.log(updatedRes, 'updatedDay res')
        }
      }

      // console.log(lastDayDynamo.map((flip) => { return {[flip.start]: flip}} ))
      // const mapified = new Map(lastDayDynamo.map((flip) => [flip.start]: flip ))

      // console.log(mapified)
      // const lastDayIcal = getLastValueInMap(groupedDays)
      // //compare mutatedData to dynamodata

      // console.log('lastDay', lastDay)

    } else {
      mutatedData = groupedDays
      await dynamoDb.put(newDbEntry).promise()
    }



    const returnData = mutatedData ? Object.fromEntries(mutatedData) : groupedDays

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(returnData),
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
