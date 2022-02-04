import AWS from "aws-sdk"
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import ical from 'node-ical'

// const dynamoDb = new AWS.DynamoDB.DocumentClient({
//   region: process.env.REGION,
// })

interface FlipEvent {
  dayBegins: number
  dayEnds: number
  start: number
  duration: number
  summary: string,
  className: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

  const fakeEvent = 'https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff'
  const userTZ = 'America/Denver'

  function returnColor(summary: string){
    switch (summary) {
      case "Jerkin": return "bg-red-600"
      case "Learning": return "bg-yellow-600"
      case "Eating": return "bg-orange-600"
      case "Sleeping": return "bg-purple-600"
      case "Weed": return "bg-amber-600"
      case "Socializing": return "bg-lime-600"
      case "Beer": return "bg-teal-600"
      case "Working out": return "bg-blue-600"
      case "Insta/tv/youtub": return "bg-pink-600"
      case "Shop/Chores": return "bg-rose-600"
      case "Skiing": return "bg-cyan-600"
      case "Norski": return "bg-black"
      default:
        "bg-white"
    }
  }

function returnWidth(duration: number) {
  const minutes = duration / 60000
  const part180 = (minutes / 8) * 10
  const rounded5 = (Math.round(part180/5)*5) / 10
  const not0 = rounded5 === 0 ? rounded5 + 0.5 : rounded5
  return `w-${not0}ch h-8`
}

function groupByDays(objectArray: FlipEvent[]) {
  return objectArray.reduce<Record<number, FlipEvent[]>>((acc, cur) => {
    console.log()
    const key = cur.dayBegins
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(cur)
    return acc
  }, {})
}

function durate(sorted: FlipEvent[]){
  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].duration = sorted[i + 1].start - sorted[i].start
    sorted[i].className = returnWidth(sorted[i].duration) + " " + returnColor(sorted[i].summary)
  }
  return sorted
}

function sortFlips(arr: FlipEvent[]){
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
          dayEnds: dayBegins + 8640000,
          start: startTime,
          duration: null,
          summary: calEvent.summary,
          className: null
        }
        eventArray.push(newShit)
      }
    }
    const sorted = sortFlips(eventArray)
    const withDuration = durate(sorted)
    const groupedDays = groupByDays(withDuration)
    console.log('groupedDaysLength:', groupedDays)
  
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(groupedDays),
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
