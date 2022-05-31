
import { useRef, useState } from 'react'
import { Day, Event, State } from "../../lib/types"
import Image from "next/dist/client/image"
import { DragEvent } from "react"
import { API } from '@aws-amplify/api'
// import { moveEnd } from '../../lib/moveEvent'

const EventsBar = ({
  state,
  // monthYear,
  // day, 
  // selectedEvent, 
  dispatch,
  dayIndex
}:
  {
    state: State
    // monthYear: string,
    // day: Day,
    // selectedEvent: Event,
    dayIndex: number
    dispatch: ({ type, event, dayKey, arrayIndex, dragEvent, distanceToFront, newData }:
      {
        type: string, event?: Event, dayKey?: string, arrayIndex?: number, dragEvent?: DragEvent,
        distanceToFront?: number, newData?: any, movingDayValueEvent?: any, dayArrayIndex?: number
      }) => void
  }) => {
  console.log('state.selectedEvent.dayArrayIndex', state.selectedEvent.dayArrayIndex)
  const eventRef = useRef(null)

  const [initialMoveState, setIniitialMoveState] = useState(0)
  const [deleteState, setDeleteState] = useState(false)

  const drag = (e: DragEvent) => {
    dispatch({ type: "drag", dragEvent: e })
  }

  const day = state.data[dayIndex]

  const dragEnd = async (e: DragEvent, duration: number) => {
    e.stopPropagation()
    const params = {
      body: {
        dayKey: state.selectedEvent.dayKey,
        monthYear: state.monthYear,
        start: state.selectedEvent.start,
        duration: duration,
      }
    }
    await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/saveDuration', params)

  }

  const deleteEvent = async () => {
    const params = {
      body: {
        dayKey: state.selectedEvent.dayKey,
        monthYear: state.monthYear,
        start: state.selectedEvent.start
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
    setIniitialMoveState(distanceToFront)
  }

  const moveEnd = (e: DragEvent) => {
    const movingFront = e.clientX - initialMoveState
    let newEventArray: any[] = []
    let moved = false

    day.dayValue.forEach((eventBox, i) => {
      const currPosition = document.getElementById(`${eventBox.start}`)?.offsetLeft ?? 0
      // console.log('currentPosition: ', currPosition, ', movingFront: ', movingFront, 'event', eventBox)
      if (!moved) {
        if (currPosition < movingFront) {
          eventBox.start = state.selectedEvent.duration + eventBox.start
          newEventArray.push(eventBox)

        } else {
          state.selectedEvent.start = eventBox.start
          console.log('eventBox.start', eventBox.start)
          eventBox.start = state.selectedEvent.duration + eventBox.start // not using movingDay cause error
          console.log('state.selectedEvent.duration + eventBox.start', state.selectedEvent.duration, eventBox.start)
          newEventArray.push(state.selectedEvent, eventBox)

          moved = true
        }
      } else {
        if (state.selectedEvent.start !== eventBox.start) {
          eventBox.start = state.selectedEvent.duration + eventBox.start
          newEventArray.push(eventBox)
        }

      }

    })

    day.dayValue = newEventArray
    state.selectedEvent.dayKey = day.dayKey
    state.data.forEach((dataDay) => {
      if (dataDay.dayKey === state.selectedEvent.dayKey) {
        dataDay = day
      }
    })
    dispatch({ type: "moved", newData: state.data, movingDayValueEvent: state.selectedEvent })

  }

  const selectEvent = (mapDataEvent: any, i: number) => {
    dispatch({
      type: "selectEvent",
      event: mapDataEvent,
      dayKey: day.dayKey,
      arrayIndex: i,
      dayArrayIndex: dayIndex
    })
  }


  return (
    <div id="grid96" className="grid grid-cols-96">
      {day.dayValue.map((mapDataEvent: Event, i: number) =>
        <>
          {mapDataEvent === state.selectedEvent
            ? // this is the rendered selectedEvent
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
                onDrag={(e) => drag(e)}
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
              onClick={() => selectEvent(mapDataEvent, i)}
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
      {state.selectedEvent.start !== 0 && state.selectedEvent.dayKey === day.dayKey
        && (!deleteState ? <div className="ml-2 col-start-96"><button

          onClick={() => setDeleteState(true)}
        >delete</button></div>
          : <div className="ml-2 col-start-96"><button

            onClick={() => deleteEvent()}
          >yes</button><button

            onClick={() => setDeleteState(false)}
          >no</button></div>)}
    </div>

  )
}


export default EventsBar