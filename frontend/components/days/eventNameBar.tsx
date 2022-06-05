import { useRef, useState } from 'react'
import { API } from '@aws-amplify/api'
import { eventKeyToColor } from '../../lib/returnClassName'
import { Day, Event } from '../../lib/types'


type DayValueArr = Event[]

interface EventAdded {
  eventName: string
  dayKey: number
  monthYear: string
  start: number
  eventNameKey: number
}

const EventNameBar = ({ monthYear, events, day, dayKey, dispatch }: {
  monthYear: string,
  events: string[],
  day: Day,
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
        dispatch({type: 'eventNameAdded', eventName: eventInputRef.current.value})
        await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/submitEventName', params)
        eventInputRef.current.value = 'new event'
      } catch (err) {
        console.log(err)
      }
    }
  }



  const addEvent = async (day: Day, event: string, eventNameKey: number) => {

    const lastEventPos = day.dayValue.length
    const lastEvent = day.dayValue[lastEventPos - 1]

    const newEventStart = lastEvent ? lastEvent.start + lastEvent.duration : 1

      const params = {
        body: {
          eventName: event,
          dayKey: "" + dayKey,
          monthYear: monthYear,
          eventNameKey: eventNameKey,
          start: newEventStart,
          duration: 6
        }
      }
      const eventEvent = {...params.body, className: "col-span-" + 6 + " h-8 " + eventKeyToColor(eventNameKey) }

    try {

      dispatch({
        type: "eventAdded", 
        event: eventEvent
      })
      await API.post(
        process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "",
        '/submitEvent',
        params
      )
      
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
              onClick={() => addEvent(day, event, i)}
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

          : events?.length <= 12 ? <button
            className="px-1 m-1 mr-2"
            onClick={() => setAddingEvent(true)}
          >+</button> 
          : null
      }
    </div>
  )
}

export default EventNameBar