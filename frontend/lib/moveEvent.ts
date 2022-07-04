import { Day, Event, State } from './types'
import { DragEvent } from 'react'

interface InitialMoveState {
  front: number
  back: number
  click: number
}

export const moved = (
  clientX: number,
  initialMoveState: InitialMoveState,
  state: State,
  day: Day
) => {
  console.log('initialMoveState', initialMoveState)

  if (initialMoveState.click < clientX) {

    console.log('moved right')
    /* move right */
    const movingTail = clientX - initialMoveState.back
    let moved = false
    let accDuration = 1
    let selected: Event

    const copiedEventArray: Event[] = JSON.parse(JSON.stringify(day.dayValue))

    return copiedEventArray.reduce((acc, cur, i) => {

      const currPosition = document.getElementById(`${cur.id}`)?.offsetLeft ?? 0
      const currentWidth = document.getElementById(`${cur.id}`)?.offsetWidth ?? 0
      const currentTail = currPosition + currentWidth

      // accDuration = 
      // cur.start === state.selectedEvent.start
      // ? accDuration
      // : accDuration + cur.duration
      console.log('day', day)
      if (cur.id === state.selectedEvent.id) {
        if (day.dayValue.length - 1 === i) { 
          acc.push(cur)
        }
        selected = cur
        return acc
      } else if (moved) {
        
        acc.push(cur) 
      } else if (currentTail > movingTail) {
        
            moved = true
            cur.arrayIndex = cur.arrayIndex + 1
            // selected.start = accDuration
            // cur.start = accDuration - cur.duration
            acc.push(cur, selected)

      } else {
        // cur.start = accDuration - cur.duration
       cur.arrayIndex = cur.arrayIndex - 1
        acc.push(cur)

          if (day.dayValue.length - 1 === i) {
          moved = true
          // selected.start = accDuration
          acc.push(selected)
        }

      }

      return acc
    }, [] as Event[])

  } else {
    const movingFront = clientX - initialMoveState.front
    let moved: boolean

    return [...day.dayValue].reduce((acc, cur, i) => {
      
      const currPosition = document.getElementById(`${cur.id}`)?.offsetLeft ?? 0
      if (cur.id === state.selectedEvent.id) {
        // if ( i === state.selectedEvent.arrayIndex) { 
        //   acc.push(cur)
        // }
        /* tried comparing Events directly, didn't work */
        return acc
      }
      else if (moved) {
        // cur.start = cur.start + state.selectedEvent.duration
        acc.push(cur)
      }
      else if (currPosition < movingFront) {
        acc.push(cur)
      } else {
        moved = true
        acc.push(
          { ...state.selectedEvent, arrayIndex: cur.arrayIndex },
          { ...cur, arrayIndex: cur.arrayIndex + 1 }
        )
      }
      return acc
    }, [] as Event[])

  }
}
