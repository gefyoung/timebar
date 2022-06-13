import { Day, Event, State } from './types'
import { DragEvent } from 'react'

interface InitialMoveState {
  front: number
  back: number
  click: number
}
export const moveEnd = (
  e: DragEvent,
  initialMoveState: InitialMoveState,
  state: State,
  day: Day,
  // dispatch: (e: any) => void
) => {
  if (initialMoveState.click < e.clientX) {
    /* move right */
    const movingTail = e.clientX - initialMoveState.back
    let moved: boolean
    let accDuration = 0

    return [...day.dayValue].reduce((acc, cur, i) => {
      const currPosition = document.getElementById(`${cur.start}`)?.offsetLeft ?? 0
      const currentWidth = document.getElementById(`${cur.start}`)?.offsetWidth ?? 0
      const currentTail = currPosition + currentWidth

      accDuration = cur.start === state.selectedEvent.start
        ? accDuration
        : accDuration + cur.duration
      if (cur.start === state.selectedEvent.start) {
        // accDuration = accDuration - cur.duration
        return acc
      }
      else if (moved) {
        // cur.start = cur.start - state.selectedEvent.duration
        acc.push(cur)
      }
      else if (currentTail < movingTail) {
        acc.push(cur)
        console.log('currtail', currentTail, 'movingTail', movingTail)
        if (day.dayValue.length === i + 1) {
          /* if last element and everything is before movedEvent */
          moved = true
          acc.push(
            { ...state.selectedEvent, /*start: cur.start + cur.duration*/ },
          )
        }

      } else {
        moved = true
        acc.push(
          { ...cur, start: state.selectedEvent.start },
          { ...state.selectedEvent, start: accDuration + 1 },
        )
      }
      return acc
    }, [] as Event[])


  } else {
    const movingFront = e.clientX - initialMoveState.front
    let moved: boolean
    console.log('e.clientX', e.clientX, 'movingfront', movingFront)

    return [...day.dayValue].reduce((acc, cur, i) => {
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

    //   dispatch({ 
    //     type: "moved", 
    //     newData: newDayValue, 
    //     movingDayValueEvent: state.selectedEvent,
    //     dayArrayIndex: dayIndex })
    // }

  }
}