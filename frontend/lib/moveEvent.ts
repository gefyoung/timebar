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

  if (initialMoveState.click < clientX) {
    /* move right */
    const movingTail = clientX - initialMoveState.back
    let moved = false
    let selected: Event
    let movedIndex: number

    const copiedEventArray: Event[] = JSON.parse(JSON.stringify(day.dayValue))

    const shit = copiedEventArray.reduce((acc, cur, i) => {

      const currPosition = document.getElementById(`${cur.id}`)?.offsetLeft ?? 0
      const currentWidth = document.getElementById(`${cur.id}`)?.offsetWidth ?? 0
      const currentTail = currPosition + currentWidth

      if (cur.id === state.selectedEvent.id) {
        if (day.dayValue.length - 1 === i) {
          console.log('pushed')
          acc.push(cur)
        }
        selected = cur
        return acc
      } else if (moved) {
        acc.push(cur)
      } else if (currentTail > movingTail) {
        moved = true
        acc.push(cur, selected)
      } else {
        acc.push(cur)
        if (day.dayValue.length - 1 === i) {
          moved = true
          acc.push(selected)
        }
      }
      return acc
    }, [] as Event[])

    shit.forEach((event, i) => {
      event.arrayIndex = i
    })

    return shit

  } else {
    /* move left*/
    const movingFront = clientX - initialMoveState.front
    let moved: boolean

    const newLeftArray = [...day.dayValue].reduce((acc, cur, i) => {

      const currPosition = document.getElementById(`${cur.id}`)?.offsetLeft ?? 0
      if (cur.id === state.selectedEvent.id) {
        if (day.dayValue.length - 1 === i && !moved) {
          acc.push(cur)
        }
        return acc
      }
      else if (moved) {
        if (cur.arrayIndex < state.selectedEvent.arrayIndex) {
          cur.arrayIndex = cur.arrayIndex + 1
        }
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

    return newLeftArray

  }
}
