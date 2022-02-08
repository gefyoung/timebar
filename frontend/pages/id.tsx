import ical from 'node-ical'
import { useRef, useState } from 'react'
import { API } from 'aws-amplify'
import axios from 'axios'

interface FlipEvent {
  dayBegins: number
  start: number
  duration: number
  summary: string,
  className: string
}

export default function Id({ data }: any) {
  console.log(data)
  const [selectedEventState, setSelectedEventState] = useState({
    summary: "",
    className: "",
    dayBegins: 0,
    startTime: 0,
    duration: 0
  })
  const [editState, setEditState] = useState('day')

  const dayTextRef = useRef<HTMLTextAreaElement>(null)
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLInputElement>(null)
  const flipTextRef = useRef<HTMLTextAreaElement>(null)

  const userTZ = 'America/Denver'

  const editFlip = () => {
    console.log(startRef.current)

    const newFlipObj = {
      flipId: selectedEventState.startTime,
      startTime: startRef.current?.value,
      endTime: endRef.current?.value,
      summary: summaryRef.current?.value,
      text: flipTextRef.current?.value
    }
    axios.post('https://npyxqhl803.execute-api.us-east-1.amazonaws.com/saveFlip', newFlipObj)
  }

  const selectFlip = (e: FlipEvent) => {
    setSelectedEventState({ 
      className: e.className, 
      summary: e.summary, 
      dayBegins: e.dayBegins, 
      startTime: e.start,
      duration: e.duration
    })
    setEditState('flip')
  }
  const addDayNotes = (e: number) => {
    setSelectedEventState({ 
      className: selectedEventState.className || '', 
      summary: selectedEventState.summary || '', 
      dayBegins: e, 
      startTime: selectedEventState.startTime,
      duration: selectedEventState.duration || 0
    })
    setEditState('day')
  }

  const FlipComponent = ({ flipEvent }: any) => {
    return <div key={flipEvent.starTime} onClick={() => selectFlip(flipEvent)}>
      <div className={flipEvent.className}>
    </div></div>
  }

  const TimeBar = ({ day }: any) => {
    return <><div key={day} className="flex overflow-hidden max-w-g">{
      day.map((flipEvent: FlipEvent) =>
        <FlipComponent key={flipEvent.start}  flipEvent={flipEvent} />
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
            && <div ><textarea className="bg-gray-200"></textarea></div> 
          }
          { selectedEventState.dayBegins === parseInt(key) && (editState === 'flip')
          && <div className='bg-gray-100'>
            <div><input type="text" defaultValue={selectedEventState.summary}></input></div>
            <div>
              Start time: <input ref={startRef} type="text" defaultValue={selectedEventState.startTime}></input>
              End time: <input ref={endRef} type="text" defaultValue={selectedEventState.startTime + selectedEventState.duration}></input>
              </div>
            <div><textarea ref={dayTextRef}></textarea></div>
            <button onClick={editFlip} className="outline">submit</button>
          </div>
        }
        </div>
      </div>)
      }
    </div>
  )
}

export async function getStaticProps() {
  try {

    const res = await fetch("https://npyxqhl803.execute-api.us-east-1.amazonaws.com/getIcal", { method: "GET" })
    const response = await res.text()

    return { props: { data: JSON.parse(response) }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}