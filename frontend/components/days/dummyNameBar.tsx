import { useRef, useState } from 'react'
import { eventKeyToColor } from '../../lib/returnClassName'
import { Day, Event, State } from '../../lib/types'
import { v4 as uuidv4 } from 'uuid'

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
      try {
        dispatch({type: 'eventNameAdded', eventName: eventInputRef.current.value})
        setEventNameState("")
      } catch (err) {
        console.log(err)
      }
    }
  }

  const clickEvent = async (
    day: Day, eventName: string, i: number, eventNameState: string
    ) => {

    const id = uuidv4()
    
    if (eventNameState === "removing") {
      const newEventArray = [...eventNames]
      newEventArray.splice(i, 1)
      
      dispatch({
        type: "eventNameDeleted", 
        eventArray: newEventArray
      })


    } else {
      
      let totalDuration = 1
      day.dayValue.forEach((dayEvent) => {
        totalDuration = totalDuration + dayEvent.duration
      })
      if (totalDuration > 96) { 
        return
      }
      const newDay = JSON.parse(JSON.stringify(day))
        const params = {
          body: {
            eventName: eventName,
            dayKey: "" + day.dayKey,
            monthYear: monthYear,
            eventNameKey: i,
            id: id,
            duration: 6,
            arrayIndex: day.dayValue.length,
          }
        }

        const newEvent = { 
          ...params.body, 
          className: "col-span-" + 6 + " h-8 " + eventKeyToColor(i),
          dayArrayIndex: dayIndex,
          monthYear: undefined
        }

        newDay.dayValue.push(newEvent)
      

        dispatch({
          type: "eventAdded",
          event: newEvent,
          dayArrayIndex: dayIndex
        })
        dispatch({
          type: "selectEvent",
          event: newEvent,
          dayKey: day.dayKey,
          arrayIndex: newDay.dayValue.length - 1,
          dayArrayIndex: dayIndex,
          id: id
        })


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