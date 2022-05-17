import { useRef, useState } from 'react'
import { API } from '@aws-amplify/api'
import { eventKeyToColor } from '../../lib/returnClassName'

interface DayValue {
  start: number
  duration: number
  eventName: string
  className: string
  text: string
}[]

const EventBar = ({ monthYear, events, dayKey, dayValue, eventNameAdded, eventAdded }: {
  monthYear: string,
  events: string[],
  dayKey: number,
  eventNameAdded: (e: string) => void,
  dayValue: DayValue,
  eventAdded: (e: {
    eventName: string
    dayKey: number
    monthYear: string
    start: number
    eventKey: number
  }) => void,
}) => {

  const [addingEvent, setAddingEvent] = useState(false)

  const eventInputRef = useRef<HTMLInputElement>(null)

  const submitEventName = async () => {
    if (eventInputRef.current?.value) {
      const params = {
        body: {
          eventName: eventInputRef.current.value,
          monthYear: monthYear
        }
      }
      try {
        await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/submitEventName', params)
        eventNameAdded(eventInputRef.current.value)
        eventInputRef.current.value = 'new event'
      } catch (err) {
        console.log(err)
      }
    }
  }

  const addEvent = async (event: string, dayValue: DayValue, i: number) => {
    let params
    /* other events exist */
    if (dayValue.length > 0) {

      const lastEvent = dayValue[dayValue.length -1]
      const newStart = lastEvent.start + lastEvent.duration
      params = {
        body: {
          eventName: event,
          dayKey: dayKey,
          monthYear: monthYear,
          start: newStart,
          eventKey: i
        }
      }

    } else {
      /* first event of the day */
      params = {
        body: {
          eventName: event,
          dayKey: dayKey,
          monthYear: monthYear,
          start: 1,
          eventKey: i
        }
      }
    }
    console.log('params', params)
    try {
      const submittedEvent = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/submitEvent', params)
      submittedEvent.className = "col-span-" + 6 + " h-8 " + eventKeyToColor(i)
      eventAdded(submittedEvent)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div key={dayKey}>
      {events?.length > 0
        && events.map((event, i) =>
          <>
            <button
              key={i}
              className="px-1 m-1 mr-2 outline-black outline outline-1"
              onClick={() => addEvent(event, i)}
            >{event}</button>
          </>)
      }{

        addingEvent
          ? <><input
            ref={eventInputRef}
            className="w-20 px-1 m-1 mr-2 outline-black outline outline-1"
          ></input>
            <button
              className="px-1 m-1 mr-2 outline-black outline outline-1"
              onClick={() => submitEventName()}
            >✔️</button></>

          : <button
            className="px-1 m-1 mr-2"
            onClick={() => setAddingEvent(true)}
          >+</button>
      }
    </div>
  )
}

export default EventBar