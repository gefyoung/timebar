import { State, Day, Event } from '../lib/types'
import { DragEvent } from 'react'
import { returnOneClassName } from './returnClassName'

const drag = (e: DragEvent, state: State, day: Day) => {
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
    console.log('dragleft')
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

export default drag