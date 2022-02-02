import ical from 'node-ical'
import { useState } from 'react'
import moment from 'moment'

interface FlipEvent {
  dayBegins: number
  dayEnds: number
  start: number
  duration: number
  startDate: Date
  summary: string,
  className: string
}


export default function Id({ data }: any) {

  const [selectedEventState, setSelectedEventState] = useState({
    summary: null,
    className: null,
    startDate: null
  })

  const selectFlip = (e: FlipEvent) => {
    console.log(e.startDate)
    // setSelectedEventState({ ...e, startDate: e.startDate.getDate() })
  }

  const FlipComponent = ({ flipEvent }: any) => {
    return <div key={flipEvent.starTime} onClick={() => selectFlip(flipEvent)}>
      <div className={flipEvent.className}>
    </div></div>
  }

  const DayComponent = ({ day }: any) => {
    return <><div className="flex my-20 overflow-hidden">{
      day.map((flipEvent: FlipEvent) =>
        <FlipComponent key={flipEvent.start}  flipEvent={flipEvent} />
      )}</div></>
  }

  return (
    <div className="mx-10">
      {
        Object.entries(data).map(([key, day]) => 
        <>
        <div className='flex '>
          {new Date(parseInt(key)).toLocaleDateString() + ' '} 
          {new Date(parseInt(key)).toLocaleString('en-us', {  weekday: 'long' })}
        </div>
        { selectedEventState.startDate === new Date(parseInt(key)) && <div className='flex '>
          { selectedEventState.summary + " " + selectedEventState.className }
        </div> }
          <DayComponent key={day} day={day} />
      </>
        )
      }
    </div>
  )
}


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
  let minutes = duration / 60000
  let part180 = (minutes / 8) * 10
  let rounded5 = (Math.round(part180/5)*5) / 10
  const not0 = rounded5 === 0 ? rounded5 + 0.5 : rounded5
  // if (rounded5 < 72) {
    return `w-${not0}ch h-8`
  // } else {
  //   return 'w-72 h-8'
  // }
}

function groupByDays(objectArray: any) {
  return objectArray.reduce(function (acc: any, obj: any) {
    let key = obj.dayBegins
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

function durate(sorted: any){
  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].duration = sorted[i + 1].start - sorted[i].start
    sorted[i].className = returnWidth(sorted[i].duration) + " " + returnColor(sorted[i].summary)
  }
  return sorted
}

// add up a day's of duration

function sortFlips(arr: any){
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


export async function getStaticProps() {
  try {
    const parsedICAL = await ical.async.fromURL('https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff')

    const eventArray: any[] = []

    for (const calEvent of Object.values(parsedICAL)) {

      

      if (calEvent.start instanceof Date) {
        const utcDate = new Date(calEvent.start)
        const convertedTZ = utcDate.toLocaleString("en-US", { timeZone: userTZ })
        console.log(convertedTZ)
        const convertedDate = new Date(convertedTZ)
        const startTime = convertedDate.getTime()

        const dayBegins = Date.parse(convertedDate.toDateString())


        let newShit = {
          dayBegins: dayBegins,
          dayEnds: dayBegins + 8640000,
          start: startTime,
          duration: null,
          startDate: calEvent.start,
          summary: calEvent.summary,
          className: null
        }
        eventArray.push(newShit)
      }
    }
    const sorted = sortFlips(eventArray)
    const withDuration = durate(sorted)
    const groupedDays = groupByDays(withDuration)

    return { props: { data: groupedDays }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}