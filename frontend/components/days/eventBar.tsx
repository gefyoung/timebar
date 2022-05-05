import { useRef, useState } from 'react'
import { API } from '@aws-amplify/api'

const EventBar = ({ monthYear, events, eventAdded }: {
  monthYear: string,
  events: string[],
  eventAdded: (e: string | undefined) => void
}) => {

  const [addingEvent, setAddingEvent] = useState(false)

  const eventInputRef = useRef<HTMLInputElement>(null)

  const submitEventName = async () => {
    if (eventInputRef.current?.value) {
      const params = { body: {
        eventName: eventInputRef.current.value,
        monthYear: monthYear }
      }
      try {
        await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/submitEventName', params)
        eventAdded(eventInputRef.current.value)
        eventInputRef.current.value = 'new event'
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div>
      {events?.length > 0
        && events.map((event) =>
          <>
            <button
              className="px-1 m-1 mr-2 outline-black outline outline-1"
              onClick={() => console.log(event)}
            >{event}</button>
          </>)}{
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
            className="px-1 m-1 mr-2 outline-black outline outline-1"
            onClick={() => setAddingEvent(true)}
          >new event</button>
      }
    </div>
  )
}

export default EventBar