import { State, Day, Event } from '../lib/types'
import { DragEvent, TouchEvent } from 'react'
import { returnOneClassName } from './returnClassName'

export const drag = (clientX: number, state: State, day: Day) => {
  const oneGridWidth = (document.getElementById("grid96")?.offsetWidth ?? 0) / 96
  const currentWidth = state.selectedEvent.duration * oneGridWidth
  const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0

  if (clientX - 5 > currentWidth + boxLeftPosition) {
    /* drag right */
    return [...day.dayValue].reduce((acc, cur, i) => {
      if (cur.id === state.selectedEvent.id) {
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
    
  } else if (clientX + 5 < currentWidth + boxLeftPosition) {
    /* drag left */

    return [...day.dayValue].reduce((acc, cur, i) => {
      if (cur.id === state.selectedEvent.id) {
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
  // let totalDuration = 1
  if (typeof state.selectedEvent.arrayIndex === 'number') { 
    const eventIndex = state.selectedEvent.arrayIndex
    
    return [...day.dayValue].reduce((acc, curr, i) => {
      curr.dayKey = day.dayKey
      // totalDuration = totalDuration + curr.duration
      /* dayKey is needed because it doesn't exist int he dayValueEvents, will crash backend */
      
      if (i > eventIndex) {
  
        // curr.start = totalDuration - curr.duration
        acc.push(curr)
      } else {
        acc.push(curr)
      }
      return acc
  
    }, [] as Event[])
   } else {
    console.log('state', state)
    return state
   }


}