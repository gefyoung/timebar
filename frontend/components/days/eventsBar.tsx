
import { useRef, useState } from 'react'
import { Day, Event, State } from "../../lib/types"
import Image from "next/dist/client/image"
import { DragEvent, TouchEvent } from "react"
import { API } from '@aws-amplify/api'
import { moved } from '../../lib/moveEvent'
import { drag, dragEnd } from '../../lib/dragEvent'

function isTouchEvent(e: DragEvent | TouchEvent): e is TouchEvent {

  if (e.type === 'touchstart' 
    || e.type === 'touchmove'
    || e.type === 'touchend') {
    return true
  } else {
    return false
  }
}


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

  const resize = (e: DragEvent | TouchEvent) => {
    const clientX = isTouchEvent(e) ? e.changedTouches[0].clientX : e.clientX
    const newArray = drag(clientX, state, day)
    dispatch({ type: "drag", newDayValue: newArray, dayArrayIndex: dayIndex })
  }

  const resizeEnd = async (e: DragEvent | TouchEvent) => {
    e.stopPropagation()
    const newArray = dragEnd(state, day)
    dispatch({ type: "dragEnd", newDayValue: newArray, dayArrayIndex: dayIndex })
    const params = {
      body: {
        dayKey: state.selectedEvent.dayKey,
        monthYear: state.monthYear,
        id: state.selectedEvent.id,
        duration: state.selectedEvent.duration
      }
    }
    
    try {
      await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/updateDuration', params)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteEvent = async () => {
    const params = {
      body: {
        dayKey: state.selectedEvent.dayKey,
        monthYear: state.monthYear,
        id: state.selectedEvent.id
      }
    }
    dispatch({ type: "eventDeleted", dayArrayIndex: dayIndex })
    setDeleteState(false)
    try {
      await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/deleteEvent', params)
    } catch (err) {
      console.log(err)
    }
  }
  
  const moveStart = (e: DragEvent | TouchEvent) => {

    const clientX = isTouchEvent(e) ? e.changedTouches[0].clientX : e.clientX
    
    const selectedEventBox = document.getElementById("selectedEventBox")
    if (!selectedEventBox) {
      console.log('error')
    } else {
      const selectedLeftPosition = selectedEventBox.offsetLeft
      const selectedRightPosition = selectedLeftPosition + selectedEventBox.offsetWidth

      const distanceToFront = clientX - selectedLeftPosition
      const distanceToEnd = selectedRightPosition - clientX

      setInitialMoveState({
        front: distanceToFront,
        back: distanceToEnd,
        click: clientX
      })
    }
  }

  const moveEnd = async (e: DragEvent | TouchEvent, mapDataEvent: Event, i: number) => {
    
    const clientX = isTouchEvent(e) ? e.changedTouches[0].clientX : e.clientX

    const newArray = moved(
      clientX,
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
    console.log('newArray', newArray)

    try {
      await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/updateEventArray', params)
    } catch (err) {
      console.log(err)
    }
  }

  const selectEvent = (mapDataEvent: Event, i: number) => {
    console.log(mapDataEvent)
    console.log('id', mapDataEvent.id)
    dispatch({
      type: "selectEvent",
      event: mapDataEvent,
      dayKey: day.dayKey,
      arrayIndex: i,
      dayArrayIndex: dayIndex,
      id: mapDataEvent.id,
    })
  }


  return (
    <div id="grid96" className="grid grid-cols-96">
      {day.dayValue.map((mapDataEvent: Event, i: number) =>
        <>
          {(mapDataEvent.id === state.selectedEvent.id)
            ? // this is the rendered selectedEvent
            <><div
              ref={eventRef}
              key={mapDataEvent.id}
              className={mapDataEvent.className + " relative border-black border-2 flex flex-row"}
              id="selectedEventBox"
              onDragStart={(e) => moveStart(e)}
              onDragEnd={(e) => moveEnd(e, mapDataEvent, i)}
              onTouchStart={(e) => moveStart(e)}
              onTouchEnd={(e) => moveEnd(e, mapDataEvent, i)}
              draggable={true}
            >
              {
                mapDataEvent.text &&
                <div id="chevron" className="mt-2 ">
                  <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>
              }

              <div
                onDrag={(e) => resize(e)}
                onDragEnd={(e) => resizeEnd(e)}
                onTouchMove={(e) => resize(e)} 
                onTouchEnd={(e) => resizeEnd(e)}
                id="resizeArrow"
                className="absolute mt-1 -right-3 cursor-ew-resize"
              >
                <Image width={16} height={16} src="/rightArrow.svg" alt="resize" />
              </div>
            </div>

            </>


            : <div
              id={mapDataEvent.id}
              key={mapDataEvent.id}
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
      {state.selectedEvent.id !== "0" && state.selectedEvent.dayKey === day.dayKey
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