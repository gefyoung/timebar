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
  day: Day
) => {
  if (initialMoveState.click < e.clientX) {
    /* move right */
    const movingTail = e.clientX - initialMoveState.back
    let moved = false
    let accDuration = 1
    let selected: Event

    return [...day.dayValue].reduce((acc, cur, i) => {
      const currPosition = document.getElementById(`${cur.start}`)?.offsetLeft ?? 0
      const currentWidth = document.getElementById(`${cur.start}`)?.offsetWidth ?? 0
      const currentTail = currPosition + currentWidth

      accDuration = 
      cur.start === state.selectedEvent.start
      ? accDuration
      : accDuration + cur.duration

      if (cur.start === state.selectedEvent.start) {
        if (day.dayValue.length - 1 === i) { 
          acc.push(cur)
        }
        selected = cur
        return acc
      } else if (moved) {
        acc.push(cur) 
      } else if (currentTail > movingTail) {

            moved = true
            selected.start = accDuration
            cur.start = accDuration - cur.duration
            acc.push(cur, selected)

      } else {
        cur.start = accDuration - cur.duration

        acc.push(cur)

          if (day.dayValue.length - 1 === i) {
          moved = true
          selected.start = accDuration
          acc.push(selected)
        }

      }

      return acc
    }, [] as Event[])


  } else {
    const movingFront = e.clientX - initialMoveState.front
    let moved: boolean


    return [...day.dayValue].reduce((acc, cur, i) => {
      const currPosition = document.getElementById(`${cur.start}`)?.offsetLeft ?? 0
      if (cur.start === state.selectedEvent.start) {
        /* tried comparing Events directly, didn't work */

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

  }
}