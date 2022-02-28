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
type Day = {
  dayKey: string
  dayValue: FlipEvent[]
  dayText?: string
}

export default function Id({ data }: { data: Day[] }) {
  // console.log(data)
  const [selectedEventState, setSelectedEventState] = useState({
    flipEvent: {
      summary: "",
      // duration: 0,
      // className: "",
      text: "",
      start: 0
    },
    dayKey: 0,
  })
  // const [editState, setEditState] = useState('day')

  const dayTextRef = useRef<HTMLTextAreaElement>(null)
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLInputElement>(null)
  const flipTextRef = useRef<HTMLTextAreaElement>(null)

  // const userTZ = 'America/Denver'

  const submitFlipEdit = async () => {
    // const duration = Number(endRef.current?.value) - Number(startRef.current?.value)
    const flip = {
        dayKey: selectedEventState.dayKey,
        // duration: duration,
        start: selectedEventState.flipEvent.start,
        summary: summaryRef.current?.value,
        text: flipTextRef.current?.value
      }

    await axios.post('https://npyxqhl803.execute-api.us-east-1.amazonaws.com/saveFlip', flip)
  }

  const selectFlip = (flipEvent: FlipEvent,  dayKey: number) => {
    setSelectedEventState({
      flipEvent: {
        // className: flipEvent.className,
        summary: flipEvent.summary,
        // duration: flipEvent.duration,
        text: flipEvent.text ?? '',
        start: flipEvent.start
      },
      dayKey: Number(dayKey)
      // arrayPos: arrayPos,
    })
    // setEditState('flip')
  }

  // const addDayNotes = (e: number) => {
  //   setSelectedEventState({ 
  //     ...selectedEventState,
  //     dayBegins: e, 
  //   })
  //   setEditState('day')
  // }

  const FlipComponent = ({ flipEvent, dayKey }: { flipEvent: FlipEvent, dayKey: string}) => (
    <div 
      key={flipEvent.start} 
      className={flipEvent.className} 
      onClick={() => selectFlip(flipEvent, Number(dayKey))}>
    </div>
  )

  const TimeBar = ({ dayValue, dayKey }: { dayValue: FlipEvent[], dayKey: string}) => {

    return <div key={dayKey} className="flex overflow-hidden max-w-g">
      {
      dayValue.map((flipEvent: FlipEvent) => {
        return <FlipComponent key={flipEvent.start} dayKey={dayKey} flipEvent={flipEvent} />
        {/* {Number(dayKey) === Number(flipEvent.start) && <div>hello</div>} */}
      }
      )}
      </div>
  }

  const FlipEditor = () => {
    return (<div className='bg-gray-100'>
      <div><input type="text" ref={summaryRef} defaultValue={selectedEventState.flipEvent.summary}></input></div>
      {/* <div>
        Start time: <input ref={startRef} type="text" defaultValue={selectedEventState.flipEvent.start}></input>
        End time: <input ref={endRef} type="text" defaultValue={selectedEventState.flipEvent.start + selectedEventState.flipEvent.duration}></input>
      </div> */}
      <div><textarea defaultValue={selectedEventState.flipEvent.text} ref={flipTextRef}></textarea></div>
      <button onClick={() => submitFlipEdit()} className="outline">submit</button>
    </div>)
  }
  
  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-col w-90ch">
      {
        data.map((day) =>
          
          <div className="mb-10" key={day.dayKey}>
            <div >
              {new Date(parseInt(day.dayKey)).toLocaleDateString() + ' '}
              {new Date(parseInt(day.dayKey)).toLocaleString('en-us', { weekday: 'long' })}
            </div>
            <TimeBar key={day.dayKey} dayKey={day.dayKey} dayValue={day.dayValue} />

            <div>
              {selectedEventState.dayKey === parseInt(day.dayKey) && <FlipEditor />}
            </div>
          </div>)
      }
      </div>
    </div>
  )
}

function getClassName(flip: FlipEvent) {
  const flipDuration = Number(flip.duration)
  console.log(flipDuration)
  const minutes = flipDuration / 60000
  const part180 = (minutes / 16) * 10
  const rounded5 = (Math.round(part180 / 5) * 5) / 10
  const width = rounded5 === 0 ? rounded5 + 0.5 : rounded5

  const color = returnColor(flip.summary)
  return "w-" + width + "ch h-8 " + color
}

function returnColor(summary: string) {
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

interface FlipInterface {
  start: number
  duration: number
  summary: string
  className?: string
}

export async function getStaticProps() {
  try {
    const res = await fetch("https://npyxqhl803.execute-api.us-east-1.amazonaws.com/getIcal", { method: "GET" })
    const response = await res.text()
    const data: Day[] = JSON.parse(response)

    data.forEach((dayObj: Day) => {
      dayObj.dayValue.forEach((flipObj) => {
        flipObj.className = getClassName(flipObj)
      })
    })
    
    return { props: { data: data }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}