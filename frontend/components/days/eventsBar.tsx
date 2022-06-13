
import { useRef, useState } from 'react'
import { Day, Event, State } from "../../lib/types"
import Image from "next/dist/client/image"
import { DragEvent } from "react"
import { API } from '@aws-amplify/api'
import { moveEnd } from '../../lib/moveEvent'
import { returnOneClassName } from '../../lib/returnClassName'

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


  const drag = (e: DragEvent) => {
    const oneGridWidth = (document.getElementById("grid96")?.offsetWidth ?? 0) / 96
    const currentWidth = state.selectedEvent.duration * oneGridWidth
    const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
    let newArray: Event[] = []

    if (e.clientX - 5 > currentWidth + boxLeftPosition) {
      /* drag right */
      newArray = [...day.dayValue].reduce((acc, cur, i) => {
        if (cur.start === state.selectedEvent.start) {
          acc.push({
            ...cur,
            duration: cur.duration + 1,
            className: returnOneClassName(cur)
          })
        } else {
          acc.push(
            cur
          )
        }
        return acc
      }, [] as Event[])
    } else {
      /* drag left */
    }

    dispatch({ type: "drag", eventArray: newArray })
  }

  interface ModifiedEvent extends Event {
    newStart: number
  }

  const dragEnd = async (e: DragEvent, duration: number) => {

    //get duration change for newSTart, newstarte element wrong
    e.stopPropagation()
    let totalDuration = 1
    const modifiedEvents = [...day.dayValue].reduce((acc, curr, i) => {
      curr.dayKey = day.dayKey
      totalDuration = totalDuration + curr.duration
      /* dayKey is needed because it doesn't exist int he dayValueEvents, will crash backend */
      if (i === state.selectedEvent.arrayIndex) {

        acc.push(curr)
      } else if (i > state.selectedEvent.arrayIndex) {
        console.log(totalDuration - curr.duration, 'dur;')
        curr.newStart = totalDuration - curr.duration
        acc.push(curr)
      }
      return acc
    }, [] as Event[])

    const params = {
      body: {
        modifiedEvents: modifiedEvents,
        // dayKey: state.selectedEvent.dayKey,
        monthYear: state.monthYear,
        // start: state.selectedEvent.start,
        // duration: duration,
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

  const moved = (e: DragEvent) => {
    const newDayValue = moveEnd(
      e,
      initialMoveState,
      state,
      day
    )

    dispatch({
      type: "moved",
      newData: newDayValue,
      movingDayValueEvent: state.selectedEvent,
      dayArrayIndex: dayIndex
    })
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
                onDrag={(e) => drag(e)}
                onDragEnd={(e) => dragEnd(e, mapDataEvent.duration)}
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