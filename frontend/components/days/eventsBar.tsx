
import { useRef, useState } from 'react'
import { Day, Event, State } from "../../lib/types"
import Image from "next/dist/client/image"
import { DragEvent } from "react"
import { API } from '@aws-amplify/api'
// import { moveEnd } from '../../lib/moveEvent'

const EventsBar = ({
  state,
  dispatch,
  dayIndex
}:
  {
    state: State
    dayIndex: number
    dispatch: ({ type, event, dayKey, arrayIndex, dragEvent, distanceToFront, newData }:
      {
        type: string, event?: Event, dayKey?: string, arrayIndex?: number, dragEvent?: DragEvent,
        distanceToFront?: number, newData?: any, movingDayValueEvent?: any, dayArrayIndex?: number
      }) => void
  }) => {
    
  const eventRef = useRef(null)

  const [initialMoveState, setInitialMoveState] = useState({
    front: 0,
    back: 0
  })
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
    setDeleteState(false)
    try {
      await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/deleteEvent', params)
    } catch (err) {
      throw err
    }
  }

  const moveStart = (e: DragEvent) => {
    const selectedLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
    const selectedRightPosition = document.getElementById("resizeArrow")?.offsetLeft ?? 0
    console.log('selectedRightPosition', selectedRightPosition)
    // this returns 0
    const distanceToFront = e.clientX - selectedLeftPosition
    // use resize arrow for boxend location    
    const distanceToEnd = selectedRightPosition - e.clientX
    setInitialMoveState({ 
      front: distanceToFront,
      back: distanceToEnd
    })
  }
  console.log(initialMoveState, 'ININIININ')

  const moveEnd = (e: DragEvent) => {
    // if (initialMoveState < e.clientX) {
    //   console.log('e.clientX', e.clientX, 'initialMoveState', initialMoveState)
    //   /* going right */
    //   const movingBack = e.clientX
    // } else {

    // }
    const movingFront = e.clientX - initialMoveState.front
    let moved: boolean
    console.log('e.clientX', e.clientX, 'movingfront', movingFront)

    const newDayValue = [...day.dayValue].reduce((acc, cur, i) => {
      const currPosition = document.getElementById(`${cur.start}`)?.offsetLeft ?? 0
      if (cur.start === state.selectedEvent.start) {
        /* tried comparing Events directly, didn't work */
        console.log('curstart is selectedStart', i, acc)
        return acc
      }

      else if (moved) {
        cur.start = cur.start + state.selectedEvent.duration
        acc.push(cur)
      }

      else if (currPosition < movingFront) {
        acc.push(cur)
      } else {
        moved = true
        acc.push(
          { ...state.selectedEvent, start: cur.start },
          { ...cur, start: cur.start + state.selectedEvent.duration }
        )
      }
      return acc
    }, [] as Event[])

    console.log("TESESTESRS", newDayValue)

    dispatch({ 
      type: "moved", 
      newData: newDayValue, 
      movingDayValueEvent: state.selectedEvent,
      dayArrayIndex: dayIndex })

  }

  const selectEvent = (mapDataEvent: Event, i: number) => {
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
          {(mapDataEvent.start === state.selectedEvent.start) 
          && (day.dayKey === state.selectedEvent.dayKey)
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
                id="resizeArrow"
                className="absolute mt-1 -right-3 cursor-ew-resize"
              >
                <Image  width={16} height={16} src="/rightArrow.svg" alt="resize" />
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