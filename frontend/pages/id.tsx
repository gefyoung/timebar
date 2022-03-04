import ical from 'node-ical'
import { useRef, useState } from 'react'
import { API } from 'aws-amplify'
import axios from 'axios'

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

export default function Id({ data }: { data: Day[] }) {
  const [selectedEventState, setSelectedEventState] = useState({
    flipEvent: {
      summary: "",
      text: "",
      start: 0
    },
    dayKey: 0,
    dayText: ""
  })

  const dayTextRef = useRef<HTMLTextAreaElement>(null)
  const summaryRef = useRef<HTMLInputElement>(null)
  const flipTextRef = useRef<HTMLTextAreaElement>(null)

  // const userTZ = 'America/Denver'

  const submitFlipText = async () => {
    const flip = {
      dayKey: selectedEventState.dayKey,
      start: selectedEventState.flipEvent.start,
      text: flipTextRef.current?.value,
    }
    await axios.post('https://npyxqhl803.execute-api.us-east-1.amazonaws.com/saveFlip', flip)
  }
  const submitDayText = async () => {
    const flip = {
      dayKey: selectedEventState.dayKey,
      start: selectedEventState.flipEvent.start,
      dayText: dayTextRef.current?.value
    }
    await axios.post('https://npyxqhl803.execute-api.us-east-1.amazonaws.com/saveFlip', flip)
  }
  const submitSummary = async () => {
    const flip = {
      dayKey: selectedEventState.dayKey,
      start: selectedEventState.flipEvent.start,
      summary: summaryRef.current?.value
    }
    await axios.post('https://npyxqhl803.execute-api.us-east-1.amazonaws.com/saveFlip', flip)
  }

  const selectFlip = (flipEvent: FlipEvent, dayKey: number) => {
    setSelectedEventState({
      flipEvent: {
        summary: flipEvent.summary,
        text: flipEvent.text ?? "",
        start: flipEvent.start
      },
      dayKey: Number(dayKey),
      dayText: ""
    })
  }

  const selectDay = (day: Day) => {
    console.log(day)
    setSelectedEventState({
      flipEvent: {
        summary: "",
        text: selectedEventState.flipEvent.text ?? "",
        start: 0
      },
      dayKey: Number(day.dayKey),
      dayText: day.dayText ?? ""
    })
  }

  // const addDayNotes = (e: number) => {
  //   setSelectedEventState({ 
  //     ...selectedEventState,
  //     dayBegins: e, 
  //   })
  //   setEditState('day')
  // }

  const FlipComponent = ({ flipEvent, dayKey }: { flipEvent: FlipEvent, dayKey: string }) => (
    <div
      key={flipEvent.start}
      className={flipEvent.className}
      onClick={() => selectFlip(flipEvent, Number(dayKey))}>
    </div>
  )

  const TimeBar = ({ day }: { day: Day }) => {

    return (
      <div className="mb-10" key={day.dayKey}>

        <div onClick={() => selectDay(day)} >
          {new Date(parseInt(day.dayKey)).toLocaleDateString() + ' '}
          {new Date(parseInt(day.dayKey)).toLocaleString('en-us', { weekday: 'long' })}
        </div>

        <div className="flex flex-row">
          {day.dayValue.map((flipEvent: FlipEvent) =>
            <FlipComponent key={flipEvent.start} dayKey={day.dayKey} flipEvent={flipEvent} />
          )}
        </div>

        <div>
          {selectedEventState.dayKey === parseInt(day.dayKey)
            && <FlipEditor />
          }
        </div>
      </div>
    )
  }

  const FlipEditor = () => {
    return (
      <div className='bg-gray-100'>
        { selectedEventState.flipEvent.summary !== "" 
          ? <div>
            <input type="text" ref={summaryRef} defaultValue={selectedEventState.flipEvent.summary}></input>
            <div>
          <textarea defaultValue={selectedEventState.flipEvent.text} ref={flipTextRef}></textarea>
        </div><button onClick={() => submitFlipText()} className="outline">submit</button>
          </div> :         <div>
          <textarea defaultValue={selectedEventState.dayText} ref={dayTextRef}></textarea>
          <button onClick={() => submitDayText()} className="outline">submit</button>
        </div>
          }
        
      </div>
    )
  }


  return (
    <div className="flex flex-row">
      <div className="flex flex-1"></div>
      <div className="mt-10 w-85ch">
        <div className="">
          {
            data.map((day) =>
              <TimeBar key={day.dayKey} day={day} />
            )
          }
        </div>
      </div>
      <div className="flex flex-1"></div>
    </div>
  )
}

function returnWidth(flip: FlipEvent) {
  const flipDuration = Number(flip.duration)
  const minutes = flipDuration / 60000
  const part180 = (minutes / 16) * 10
  const rounded5 = (Math.round(part180 / 5) * 5) / 10
  const width = rounded5 === 0 ? rounded5 + 0.5 : rounded5
  return width
}

function returnColor(summary: string) {
  switch (summary) {
    case "Jerkin": return "bg-red-600"
    case "Learning": return "bg-yellow-600"
    case "Type 1 leisure": return "bg-orange-600"
    case "Sleeping": return "bg-purple-600"
    case "Weed": return "bg-amber-600"
    case "Socializing": return "bg-lime-600"
    case "Beer": return "bg-teal-600"
    case "Working out": return "bg-blue-600"
    case "Type 2 leisure": return "bg-pink-600"
    case "Shop/Chores": return "bg-rose-600"
    case "Skiing": return "bg-cyan-600"
    case "Norski": return "bg-black"
    default:
      "bg-white"
  }
}

export async function getStaticProps() {
  try {
    const res = await fetch("https://npyxqhl803.execute-api.us-east-1.amazonaws.com/getIcal", { method: "GET" })
    const response = await res.text()
    const data: Day[] = JSON.parse(response)

    data.forEach((dayObj: Day) => {
      let i = 0
      dayObj.dayValue.forEach((flipObj) => {
        if (Number(flipObj.start) === 0) { dayObj.dayText = flipObj.text; console.log("hi", flipObj.text) }
        const color = returnColor(flipObj.summary)
        const width = returnWidth(flipObj)
        flipObj.className = "w-" + width + "ch h-8 " + color
        i = i + width
      })
      // console.log(i)
    })

    return { props: { data: data }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}