import ical from 'node-ical'
import { useState } from 'react'

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
    startTime: new Date()
  })

  const selectFlip = (e: FlipEvent) => {

    setSelectedEventState({ 
      className: e.className, 
      summary: e.summary, 
      startDate: e.dayBegins, 
      startTime: (new Date(e.start))
    })
  }

  const FlipComponent = ({ flipEvent }: any) => {
    return <div key={flipEvent.starTime} onClick={() => selectFlip(flipEvent)}>
      <div className={flipEvent.className}>
    </div></div>
  }

  const DayComponent = ({ day }: any) => {
    return <><div key={day} className="flex my-20 overflow-hidden max-w-g">{
      day.map((flipEvent: FlipEvent) =>
        <FlipComponent key={flipEvent.start}  flipEvent={flipEvent} />
      )}</div></>
  }

  return (
    <div className="mx-10">
      {
      Object.entries(data).map(([key, day]) => 
      <div key={key}>
        <div>
          {new Date(parseInt(key)).toLocaleDateString() + ' '} 
          {new Date(parseInt(key)).toLocaleString('en-us', {  weekday: 'long' })}
        </div>
        { selectedEventState.startDate === parseInt(key) 
          && selectedEventState.summary + " " + selectedEventState.startTime 
        }
        <DayComponent key={day} day={day} />
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