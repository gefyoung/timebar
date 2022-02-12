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

  // function returnColor(summary: string){
  //   switch (summary) {
  //     case "Jerkin": return "bg-red-600"
  //     case "Learning": return "bg-yellow-600"
  //     case "Eating": return "bg-orange-600"
  //     case "Sleeping": return "bg-purple-600"
  //     case "Weed": return "bg-amber-600"
  //     case "Socializing": return "bg-lime-600"
  //     case "Beer": return "bg-teal-600"
  //     case "Working out": return "bg-blue-600"
  //     case "Insta/tv/youtub": return "bg-pink-600"
  //     case "Shop/Chores": return "bg-rose-600"
  //     case "Skiing": return "bg-cyan-600"
  //     case "Norski": return "bg-black"
  //     default:
  //       "bg-white"
  //   }
  // }

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
  function sortDays(dayMap: any) {
    return new Map([...dayMap].sort((dayKey1: number, dayKey2: number) => {
      if (dayKey1 < dayKey2) {
        return -1
      } else if (dayKey2 < dayKey1) {
        return 1
      } else {
        return 0
      }
    }))
  }

  // function returnWidth(duration: number) {
  //   const minutes = duration / 60000
  //   const part180 = (minutes / 16) * 10
  //   const rounded5 = (Math.round(part180/5)*5) / 10
  //   return rounded5 === 0 ? rounded5 + 0.5 : rounded5
  // }
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
          // className: "w-" + returnWidth(nextDayDuration) + "ch h-8 " + returnColor(sorted[i].summary)
        }
        newEvents.push({i: i, newFlip: newFlip})
      }
      // sorted[i].className = "w-" + returnWidth(sorted[i].duration) + "ch h-8 " + returnColor(sorted[i].summary)

    }
    newEvents.forEach((newFlip) => {
      sorted.splice(newFlip.i, 0, newFlip.newFlip)
    })
    return sorted
  }

  function groupByDays(objectArray: FlipEvent[]) {
    return objectArray.reduce<Record<number, FlipEvent[]>>((acc, cur) => {
      const key = cur.dayBegins
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(cur)
      return acc
    }, {})
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
          className: null
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
    const updateDb = {

    }

    const newDbEntry = {
      Item: {
        user: 'gty',
        days: groupedDays
      },
      TableName: process.env.UserDays?? 'noTable'
    }


    const userExists = await dynamoDb.get(getDays).promise()
    if (userExists.Item) {
      // const reSorted = sortDays(Object.entries(userExists.Item.days))
      const newMap = new Map(Object.entries(userExists.Item.days))

      for await (const [key, value] of Object.entries(groupedDays)) {

        if (!newMap.has(key)) {
          const updateMap = {
            ExpressionAttributeNames: { "#DA": "days", "#ID": key },
            ExpressionAttributeValues: { ":dm": value },
            Key: { user: 'gty' },
            ReturnValues: "ALL_NEW",
            TableName: process.env.UserDays?? 'noTable',
            UpdateExpression: "SET #DA.#ID = :dm"
          }
          const updatedRes = await dynamoDb.update(updateMap).promise()
          const sortUpdateRes = sortDays(updatedRes)
          return {
            statusCode: 200,
            body: JSON.stringify(Object.fromEntries(sortUpdateRes)),
          }
        } else {
          const getResSorted = sortDays(newMap)
          return {
            statusCode: 200,
            body: JSON.stringify(Object.fromEntries(getResSorted)),
          }
        }
      }

    } else {
      await dynamoDb.put(newDbEntry).promise()
      return {
        statusCode: 200,
        body: JSON.stringify(groupedDays),
      } 
    }


  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify('outside if/else'),
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
