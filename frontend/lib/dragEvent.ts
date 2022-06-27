import { State, Day, Event } from '../lib/types'
import { DragEvent, TouchEvent } from 'react'
import { returnOneClassName } from './returnClassName'

export const drag = (e: DragEvent, state: State, day: Day) => {
  const oneGridWidth = (document.getElementById("grid96")?.offsetWidth ?? 0) / 96
  const currentWidth = state.selectedEvent.duration * oneGridWidth
  const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
  let newArray: Event[] = []
  
  if (e.clientX - 5 > currentWidth + boxLeftPosition) {
    /* drag right */
    return [...day.dayValue].reduce((acc, cur, i) => {
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
    
  } else if (e.clientX + 5 < currentWidth + boxLeftPosition) {
    /* drag left */

    return [...day.dayValue].reduce((acc, cur, i) => {
      if (cur.start === state.selectedEvent.start) {
        acc.push({
          ...cur,
          duration: (cur.duration - 1) > 0 ? cur.duration - 1 : 1,
          className: returnOneClassName(cur)
        })
      } else {
        acc.push(
          cur
        )
      }
      return acc
    }, [] as Event[])
  }
}

export const touchDrag = (e: TouchEvent, state: State, day: Day) => {
  const oneGridWidth = (document.getElementById("grid96")?.offsetWidth ?? 0) / 96
  const currentWidth = state.selectedEvent.duration * oneGridWidth
  const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
  let newArray: Event[] = []
  
  if (e.changedTouches[0].clientX - 5 > currentWidth + boxLeftPosition) {
    /* drag right */
    return [...day.dayValue].reduce((acc, cur, i) => {
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
    
  } else if (e.changedTouches[0].clientX + 5 < currentWidth + boxLeftPosition) {
    /* drag left */

    return [...day.dayValue].reduce((acc, cur, i) => {
      if (cur.start === state.selectedEvent.start) {
        acc.push({
          ...cur,
          duration: (cur.duration - 1) > 0 ? cur.duration - 1 : 1,
          className: returnOneClassName(cur)
        })
      } else {
        acc.push(
          cur
        )
      }
      return acc
    }, [] as Event[])
  }
}



export const dragEnd = (state: State, day: Day) => {
  let totalDuration = 1

  return [...day.dayValue].reduce((acc, curr, i) => {
    curr.dayKey = day.dayKey
    totalDuration = totalDuration + curr.duration
    /* dayKey is needed because it doesn't exist int he dayValueEvents, will crash backend */
    
    if (i > state.selectedEvent.arrayIndex) {

      curr.start = totalDuration - curr.duration
      acc.push(curr)
    } else {
      acc.push(curr)
    }
    return acc

  }, [] as Event[])
}