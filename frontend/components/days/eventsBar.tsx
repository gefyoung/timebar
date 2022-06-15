
import { useRef, useState } from 'react'
import { Day, Event, State } from "../../lib/types"
import Image from "next/dist/client/image"
import { DragEvent } from "react"
import { API } from '@aws-amplify/api'
import { moveEnd } from '../../lib/moveEvent'
import { drag, dragEnd } from '../../lib/dragEvent'

const EventsBar = ({
  state,
  dispatch,
  dayIndex
}:
  {
    state: State
    dayIndex: number
    dispatch: (e: any) => void
  }) => {

  const eventRef = useRef(null)

  const [initialMoveState, setInitialMoveState] = useState({
    front: 0,
    back: 0,
    click: 0
  })
  const [deleteState, setDeleteState] = useState(false)

  const day = state.data[dayIndex]

  const onDrag = (e: DragEvent) => {
    const newArray = drag(e, state, day)
    dispatch({ type: "drag", newDayValue: newArray, dayArrayIndex: dayIndex })
  }

  const onDragEnd = async (e: DragEvent) => {
    e.stopPropagation()
    const newArray = dragEnd(state, day)
    dispatch({ type: "dragEnd", newDayValue: newArray, dayArrayIndex: dayIndex })
    const params = {
      body: {
        modifiedEvents: newArray,
        dayKey: state.selectedEvent.dayKey,
        monthYear: state.monthYear
      }
    }
   await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/updateEventArray', params)
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
    const selectedEventBox = document.getElementById("selectedEventBox")
    if (!selectedEventBox) {
      console.log('error')
    } else {
      const selectedLeftPosition = selectedEventBox.offsetLeft
      const selectedRightPosition = selectedLeftPosition + selectedEventBox.offsetWidth

      const distanceToFront = e.clientX - selectedLeftPosition
      const distanceToEnd = selectedRightPosition - e.clientX

      setInitialMoveState({
        front: distanceToFront,
        back: distanceToEnd,
        click: e.clientX
      })
    }
  }

  const moved = async (e: DragEvent) => {
    const newArray = moveEnd(
      e,
      initialMoveState,
      state,
      day
    )

    dispatch({
      type: "moved",
      newDayValue: newArray,
      // movingDayValueEvent: state.selectedEvent,
      dayArrayIndex: dayIndex
    })

    const params = {
      body: {
        modifiedEvents: newArray,
        dayKey: state.selectedEvent.dayKey,
        monthYear: state.monthYear
      }
    }

    try {
      await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/updateEventArray', params)
    } catch (err) {
      throw err
    }
  }



  const selectEvent = (mapDataEvent: Event, i: number) => {
    console.log(mapDataEvent, 'event')
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
              onDragEnd={(e) => moved(e)}
              draggable={true}
            >
              {
                mapDataEvent.text &&
                <div id="chevron" className="mt-2 ">
                  <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>
              }

              <div
                onDrag={(e) => onDrag(e)}
                onDragEnd={(e) => onDragEnd(e)}
                // onTouchStart={(e) => touchMove(e)}
                // onTouchMove={(e) => dispatch({ type: "touchMove", touchEvent: e })} 
                // onTouchEnd={() => dragEnd(flipEvent.duration)}
                id="resizeArrow"
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