
import { useRef, useState } from 'react'
import { Day, Event } from "../../lib/types"
import Image from "next/dist/client/image"
import { DragEvent } from "react"
import { API } from '@aws-amplify/api'
import { State } from '../../lib/daysReducer'


const EventsBar = ({ 
  state,
  monthYear,
  day, 
  selectedEvent, 
  dispatch,
 }:
  {
    state: State
    monthYear: string,
    day: Day,
    selectedEvent: Event,
    dispatch: ({type, event, dayKey, arrayIndex, dragEvent, distanceToFront}: 
      {type: string, event?: Event, dayKey?: string, arrayIndex?: number, dragEvent?: DragEvent,
        distanceToFront?: number
       }) => void
  }) => {

  const eventRef = useRef(null)

  const [move, setMove] = useState(0)

  
  const dragEnd = async (e: DragEvent, duration: number) => {
      e.stopPropagation()
    const params = {
      body: {
        dayKey: selectedEvent.dayKey,
        monthYear: monthYear,
        start: selectedEvent.start,
        duration: duration,
      }
    }
    await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/saveDuration', params)

  }

  const deleteEvent = async () => {
    const params = {
      body: {
        dayKey: selectedEvent.dayKey,
        monthYear: monthYear,
        start: selectedEvent.start
      }
    }

    dispatch({ type: "eventDeleted" })

    try {
      await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/deleteEvent', params)
    } catch (err) {
      throw err
    }
  }

  const moveStart = (e: DragEvent) => {
    const selectedLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
    const distanceToFront = e.clientX - selectedLeftPosition
    setMove(distanceToFront)
  }

  const moveEnd = (e: DragEvent) => {
    const movingFront = e.clientX - move
    let newEventArray: any[] = []
    let moved = false
    let movingDayValueEvent: any
    movingDayValueEvent = day.dayValue[state.selectedEvent.arrayIndex] // this works

          day.dayValue.forEach((eventBox, i) => {
            const currPosition = document.getElementById(`${eventBox.start}`)?.offsetLeft ?? 0
            // console.log('currentPosition: ', currPosition, ', movingFront: ', movingFront, 'event', eventBox)
            if (!moved) {
              if (currPosition < movingFront) {
                eventBox.start = movingDayValueEvent.duration + eventBox.start
                newEventArray.push(eventBox)
                
              } else {
                movingDayValueEvent.start = eventBox.start
                console.log('eventBox.start', eventBox.start)
                eventBox.start = state.selectedEvent.duration + eventBox.start // not using movingDay cause error
                console.log('state.selectedEvent.duration + eventBox.start', state.selectedEvent.duration,  eventBox.start)
                newEventArray.push(movingDayValueEvent, eventBox)
                
                moved = true
              }
            } else {
              if (movingDayValueEvent.start !== eventBox.start) {
                eventBox.start = movingDayValueEvent.duration + eventBox.start
                newEventArray.push(eventBox)
              }
              
            }

          })
        day.dayValue = newEventArray
        movingDayValueEvent.dayKey = day.dayKey
    
    dispatch({ type: "moved", newDay: day  })

  }


  return (
    <div id="grid96" className="grid grid-cols-96">
      {day.dayValue.map((mapDataEvent: Event, i: number) =>
        <>
          {selectedEvent.start === mapDataEvent.start
            && selectedEvent.dayKey === day.dayKey
            ?
            <><div
              ref={eventRef}
              key={mapDataEvent.start}
              className={mapDataEvent.className + " relative border-black border-2 flex flex-row"}
              id="selectedEventBox"
              onDragStart={(e) => moveStart(e)}
              onDragEnd={(e) => moveEnd(e)}
              draggable={true}
            >
                {
                  mapDataEvent.text &&
                  <div id="chevron" className="mt-2 ">
                    <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                  </div>
                }
                
                <div 
                  onDrag={(e) => dispatch({ type: "drag", dragEvent: e })} 
                  onDragEnd={(e) => dragEnd(e, mapDataEvent.duration)}
                  // onTouchStart={(e) => touchMove(e)}
                  // onTouchMove={(e) => dispatch({ type: "touchMove", touchEvent: e })} 
                  // onTouchEnd={() => dragEnd(flipEvent.duration)}

                  className="absolute mt-1 -right-3 cursor-ew-resize"
                >
                  <Image width={16} height={16} src="/rightArrow.svg" alt="resize" />
                </div>

            </div>

            </>


            : <div
              id={"" + mapDataEvent.start}
              key={mapDataEvent.start}
              className={mapDataEvent.className}
              onClick={() => {

                dispatch({
                type: "selectEvent",
                event: mapDataEvent, 
                dayKey: day.dayKey, 
                arrayIndex: i
                
              })}}
            >
              {
                mapDataEvent.text &&
                <div className="flex mt-3 ml-0.5"><Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>
              }
            </div>

          }
        </>
      )}
      {selectedEvent.start !== 0 && selectedEvent.dayKey === day.dayKey
        && <button
          className="ml-2"
          onClick={() => deleteEvent() }
        >delete</button>}
    </div>

  )
}


export default EventsBar