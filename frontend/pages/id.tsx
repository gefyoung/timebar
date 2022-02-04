import ical from 'node-ical'
import { useState } from 'react'

interface FlipEvent {
  dayBegins: number
  dayEnds: number
  start: number
  duration: number
  summary: string,
  className: string
}

export default function Id({ data }: any) {

  const userTZ = 'America/Denver'

  console.log('responseFrontend', data)

  const [selectedEventState, setSelectedEventState] = useState({
    summary: "",
    className: "",
    startDate: 0
  })

  const selectFlip = (e: FlipEvent) => {
    const startDate = new Date(e.dayBegins)
    console.log(e.dayBegins)
    setSelectedEventState({ className: e.className, summary: e.summary, startDate: e.dayBegins })
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
        { selectedEventState.startDate === parseInt(key) 
          && selectedEventState.summary + " " + selectedEventState.className 
        }
        <DayComponent key={day} day={day} />
      </>)
      }
    </div>
  )

  return null
}





export async function getStaticProps() {
  try {

    const res = await fetch("https://npyxqhl803.execute-api.us-east-1.amazonaws.com/getIcal", { method: "GET" })
    const response = await res.text()
    console.log(response)

    return { props: { data: JSON.parse(response) }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}