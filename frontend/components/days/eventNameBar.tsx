import { useRef, useState } from 'react'
import { API } from '@aws-amplify/api'
import { eventKeyToColor } from '../../lib/returnClassName'
import { Day, Event, State } from '../../lib/types'

const EventNameBar = ({ state, monthYear, eventNames, day, dayIndex, dispatch }: {
  state: State
  monthYear: string
  eventNames: string[]
  day: Day
  dayIndex: number
  dispatch: (e: any) => void
}) => {

  const [eventNameState, setEventNameState] = useState("")
  

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
        setEventNameState("")
        await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/submitEventName', params)
        // eventInputRef.current.value = 'new event'
      } catch (err) {
        console.log(err)
      }
    }
  }



  const clickEvent = async (
    day: Day, eventName: string, i: number, eventNameState: string
    ) => {


    
    if (eventNameState === "removing") {
      const newEventArray = [...eventNames]
      newEventArray.splice(i, 1)
      
      const params = {
        body: {
          eventNameArray: newEventArray,
          monthYear: monthYear
        }
      }

    try {
      dispatch({
        type: "eventNameDeleted", 
        eventArray: newEventArray
      })
      await API.post(
        process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "",
        '/deleteEventName',
        params
      )
      
    } catch (err) {
      console.log(err)
    }

    } else {
      let totalDuration = 1
      day.dayValue.forEach((dayEvent) => {
        totalDuration = totalDuration + dayEvent.duration
      })
      const newDay = JSON.parse(JSON.stringify(day))

        const params = {
          body: {
            eventName: eventName,
            dayKey: "" + day.dayKey,
            monthYear: monthYear,
            eventNameKey: i,
            start: totalDuration,
            duration: 6,
          }
        }

        const newEvent = { 
          ...params.body, 
          className: "col-span-" + 6 + " h-8 " + eventKeyToColor(i),
          arrayIndex: day.dayValue.length,
          dayArrayIndex: dayIndex,
          monthYear: undefined
        }

        newDay.dayValue.push(newEvent)
        
      try {
  
        dispatch({
          type: "eventAdded",
          day: newDay,
          dayArrayIndex: dayIndex,
        })
        dispatch({
          type: "selectEvent",
          event: newEvent,
          dayKey: day.dayKey,
          arrayIndex: newDay.dayValue.length - 1,
          dayArrayIndex: dayIndex
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

  }


  return (
    <div>
      
      
      { eventNames?.length > 0
        && eventNames.map((eventName, i) =>
          <>
            <button
              key={i}
              className={
                eventNameState === "removing" 
                ? "bg-red-200 px-1 m-1 mr-2 outline-black outline outline-1" 
                : "px-1 m-1 mr-2 outline-black outline outline-1"
              }
              onClick={() => clickEvent(day, eventName, i, eventNameState)}
            >{eventName}</button>
          </>)
      }
      
      {
        eventNameState === "adding"
          ? <><input
            ref={eventInputRef}
            className="w-20 px-1 m-1 mr-2 outline-black outline outline-1"
          ></input>
            <button
              className="px-1 m-1 mr-2 outline-black outline outline-1"
              onClick={() => submitEventName()}
            >✔️</button></>

          : eventNames?.length < 12 ? <><button
            className="px-1 m-1 mr-2"
            onClick={() => setEventNameState("adding")}
          >+</button> <button
          className="px-1 m-1 ml-4 mr-2 "
          onClick={() => eventNameState !== "removing" 
            ? setEventNameState("removing")
          : setEventNameState("")}
        >-</button> </>
          
          : <button
          className="px-1 m-1 ml-4 mr-2 "
          onClick={() => eventNameState !== "removing" 
            ? setEventNameState("removing")
          : setEventNameState("")}
        >-</button>
      }
    </div>
  )
}

export default EventNameBar