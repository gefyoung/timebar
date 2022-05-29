import { useRef, useState } from 'react'
import { API } from '@aws-amplify/api'
import { eventKeyToColor } from '../../lib/returnClassName'
import { Event } from '../../lib/types'


type DayValueArr = Event[]

interface EventAdded {
  eventName: string
  dayKey: number
  monthYear: string
  start: number
  eventNameKey: number
}

const EventNameBar = ({ monthYear, events, dayKey, dispatch }: {
  monthYear: string,
  events: string[],
  dayKey: number,
  dispatch: (e: any) => void
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
        dispatch(eventInputRef.current.value)
        eventInputRef.current.value = 'new event'
      } catch (err) {
        console.log(err)
      }
    }
  }

  const addEvent = async (event: string, i: number) => {
    let params

      params = {
        body: {
          eventName: event,
          dayKey: dayKey,
          monthYear: monthYear,
          eventNameKey: i
        }
      }

    try {
      const submittedEvent = await API.post(
        process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "",
        '/submitEvent',
        params
      )
      submittedEvent.className = "col-span-" + 6 + " h-8 " + eventKeyToColor(i)
      dispatch({
        type: "eventAdded", 
        event: submittedEvent
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
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

export default EventNameBar