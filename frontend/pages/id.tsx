import ical from 'node-ical'
import { useRef, useState } from 'react'
import { API } from 'aws-amplify'
import axios from 'axios'

interface FlipEvent {
  dayBegins: number
  start: number
  duration: number
  summary: string
  className: string
  text?: string
}

export default function Id({ data }: any) {
  
  const [selectedEventState, setSelectedEventState] = useState({
    summary: "",
    className: "",
    dayBegins: 0,
    startTime: 0,
    duration: 0,
    arrayPos: 0,
    flipText: ''
  })
  const [editState, setEditState] = useState('day')

  const dayTextRef = useRef<HTMLTextAreaElement>(null)
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLInputElement>(null)
  const flipTextRef = useRef<HTMLTextAreaElement>(null)

  const userTZ = 'America/Denver'

  const submitFlipEdit = async () => {
    const duration = Number(endRef.current?.value) - Number(startRef.current?.value)
    const newDay = {
      ...data[selectedEventState.dayBegins],
      [selectedEventState.arrayPos]: {
        // className: "w-2ch h-8 bg-gray-200",
        dayBegins: selectedEventState.dayBegins,
        duration: duration,
        start: Number(startRef.current?.value),
        summary: summaryRef.current?.value,
        text: flipTextRef.current?.value
      }
    }
    const dayArray = Array.from(Object.values(newDay))
    // im iterating out over an array, I need to know what position this is in
    await axios.post('https://npyxqhl803.execute-api.us-east-1.amazonaws.com/saveFlip', dayArray)
  }

  const selectFlip = (arrayPos: number, e: FlipEvent) => {
    setSelectedEventState({ 
      className: e.className, 
      summary: e.summary, 
      dayBegins: e.dayBegins, 
      startTime: e.start,
      duration: e.duration,
      arrayPos: arrayPos,
      flipText: e.text ?? ''
    })
    setEditState('flip')
  }

  const addDayNotes = (e: number) => {
    setSelectedEventState({ 
      ...selectedEventState,
      dayBegins: e, 
    })
    setEditState('day')
  }

  const FlipComponent = ({ flipEvent, arrayPos }: any) => {
    return <div key={flipEvent.starTime} onClick={() => selectFlip(arrayPos, flipEvent)}>
      <div className={flipEvent.className}>
    </div></div>
  }

  const TimeBar = ({ day }: any) => {
    return <><div key={day} className="flex overflow-hidden max-w-g">{
      day.map((flipEvent: FlipEvent, arrayPos: number) =>
        <FlipComponent key={flipEvent.start} arrayPos={arrayPos} flipEvent={flipEvent} />
      )}</div></>
  }

  return (
    <div className="mx-10">
      {
      Object.entries(data).map(([key, day]) => 
      <div className="mb-10" key={key}>
        <div onClick={() => addDayNotes(parseInt(key))}>
          {new Date(parseInt(key)).toLocaleDateString() + ' '} 
          {new Date(parseInt(key)).toLocaleString('en-us', {  weekday: 'long' })}
        </div>
        
        <TimeBar key={day} day={day} />
        
        <div>
          { (parseInt(key) === selectedEventState.dayBegins) && (editState === 'day')
            && <div ><textarea ref={dayTextRef} className="bg-gray-200"></textarea></div> 
          }

          { selectedEventState.dayBegins === parseInt(key) && (editState === 'flip')
          && <div className='bg-gray-100'>
            <div><input type="text" ref={summaryRef} defaultValue={selectedEventState.summary}></input></div>
            <div>
              Start time: <input ref={startRef} type="text" defaultValue={selectedEventState.startTime}></input>
              End time: <input ref={endRef} type="text" defaultValue={selectedEventState.startTime + selectedEventState.duration}></input>
              </div>
            <div><textarea defaultValue={selectedEventState.flipText} ref={flipTextRef}></textarea></div>
            <button onClick={() => submitFlipEdit()} className="outline">submit</button>
          </div>
        }
        </div>
      </div>)
      }
    </div>
  )
}

function getClassName(flip: FlipEvent) {
  const minutes = flip.duration / 60000
  const part180 = (minutes / 16) * 10
  const rounded5 = (Math.round(part180/5)*5) / 10
  const width = rounded5 === 0 ? rounded5 + 0.5 : rounded5

  const color = returnColor(flip.summary)
  return "w-" + width + "ch h-8 " + color
}

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

interface FlipInterface {
  duration: number
  summary: string,
  // className: string
}

export async function getStaticProps() {
  try {
    const res = await fetch("https://npyxqhl803.execute-api.us-east-1.amazonaws.com/getIcal", { method: "GET" })
    const response = await res.text()
    console.log(response)
    const data: Map<string, Map<string, FlipInterface>> = JSON.parse(response)
    console.log(data,'data')

    // Object.values(data).forEach((day: Map<string, FlipInterface>) => {
    //   console.log(day, 'day')
    //   day.forEach((flip: any) => {
    //     flip.className = getClassName(flip)
    //   })
    // })
    
    return { props: { data: data }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}