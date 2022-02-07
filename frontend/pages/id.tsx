import ical from 'node-ical'
import { useState } from 'react'
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

  const userTZ = 'America/Denver'

  const [selectedEventState, setSelectedEventState] = useState({
    summary: "",
    className: "",
    startDate: 0,
    startTime: new Date(),
    duration: 0
  })

  const [editState, setEditState] = useState('day')

  const editFlip = () => {
    axios.post(process.env.backendHTTPapi)
  }

  const selectFlip = (e: FlipEvent) => {
    setSelectedEventState({ 
      className: e.className, 
      summary: e.summary, 
      startDate: e.dayBegins, 
      startTime: (new Date(e.start)),
      duration: e.duration
    })
    setEditState('flip')
  }
  const addDayNotes = (e: number) => {
    setSelectedEventState({ 
      className: selectedEventState.className || '', 
      summary: selectedEventState.summary || '', 
      startDate: e, 
      startTime: selectedEventState.startTime || new Date(),
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
          { (parseInt(key) === selectedEventState.startDate) && (editState === 'day')
            && <div ><textarea className="bg-gray-200"></textarea></div> 
          }
          { selectedEventState.startDate === parseInt(key) && (editState === 'flip')
          && <div className='bg-gray-100'>
            <div><input type="text" defaultValue={selectedEventState.summary}></input></div>
            <div>
              Start time: <input type="Date" defaultValue={selectedEventState.startTime}></input>
              End time: <input type="Date" defaultValue={selectedEventState.startTime}></input>
              </div>
            <div><textarea></textarea></div>
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