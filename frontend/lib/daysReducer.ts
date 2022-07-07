import { Day, Event, State } from "./types"
import { API } from '@aws-amplify/api'
import { DragEvent } from "react"
import { returnOneClassName } from '../lib/returnClassName'

interface ReducerEvent {
  type: string
  day?: Day
  dayKey?: string
  text?: string
  event?: Event
  arrayIndex?: number
  eventName?: string
  dragEvent?: DragEvent
  distanceToFront?: number
  newDayValue: Event[]
  movingDayValueEvent?: any
  dayArrayIndex?: number
  eventArray?: string[]
  id?: string
}

const reducer = (state: State, event: ReducerEvent): State => {

  if (event.type === "selectEvent") {
    if (typeof event.dayArrayIndex !== 'number'
      || typeof event.arrayIndex !== 'number'
      || !event.dayKey
      || !event.id) {
      return state
    }
    const text = { ...state.data[event.dayArrayIndex].dayValue[event.arrayIndex] }.text ?? ""
    return {
      ...state,
      selectedEvent: {
        ...state.data[event.dayArrayIndex].dayValue[event.arrayIndex],
        dayKey: event.dayKey,
        arrayIndex: event.arrayIndex,
        dayArrayIndex: event.dayArrayIndex,
        text: text,
        id: event.id
      }
    }

  } else if (event.type === "deselectDay") {
    return {
      ...state,
      selectedEvent: {
        eventName: "",
        text: "",
        id: "0",
        className: "",
        arrayIndex: 0,
        duration: 0,
        dayKey: "0",
        dayArrayIndex: 0
      }
    }

  } else if (event.type === "selectDay") {
    return {
      ...state,
      selectedEvent: {
        ...state.selectedEvent,
        eventName: "",
        id: "0",
        dayKey: event.dayKey ?? "0",
        text: event.text
      }
    }


  } else if (event.type === "changeText") {

    const dayArray = JSON.parse(JSON.stringify(state.data))

    if (typeof event.dayArrayIndex !== 'number') {
      console.log('dayArrayIndexError'); return state
    }

    if (state.selectedEvent.eventName === "") {
      /*update dayText*/
      // console.log('updatedeventsext')
      dayArray[event.dayArrayIndex] =
      {
        ...dayArray[event.dayArrayIndex],
        dayText: event.text
      }
      return {
        ...state,
        data: dayArray
      }

    } else {
      /* update eventText */

      if (typeof event.arrayIndex !== 'number') { return state }

      dayArray[event.dayArrayIndex].dayValue[event.arrayIndex].text = event.text
      return {
        ...state,
        data: dayArray
      }

    }

  } else if (event.type === "eventNameAdded") {
    if (!state.events) {
      return {
        ...state,
        events: [event.eventName ?? ""]
      }
    }
    return {
      ...state,
      events: state.events.concat([event.eventName ?? ""])
    }


  } else if (event.type === "eventAdded") {
    const editedArray = JSON.parse(JSON.stringify(state.data))
    if (
      typeof event.dayArrayIndex !== 'number'
      || !event.event
      || typeof event.event.arrayIndex !== 'number'
      ) {
      return state
    }
    editedArray[event.dayArrayIndex].dayValue[event.event.arrayIndex] = event.event
    return { 
      ...state, 
      data: editedArray, 
    }


  } else if (event.type === "eventNameDeleted") {
    if (event.eventArray) {
      return { ...state, events: event.eventArray }
    }

  } else if (event.type === "eventDeleted") {

    const editedArray = JSON.parse(JSON.stringify(state.data))
    if (typeof event.dayArrayIndex !== 'number'
      || typeof state.selectedEvent.arrayIndex !== 'number') {
      return state
    }
    editedArray[event.dayArrayIndex].dayValue.splice(state.selectedEvent.arrayIndex, 1)

    return { ...state, data: editedArray }


  } else if (event.type === "moved") {
    if (typeof event.dayArrayIndex === 'number' && event.newDayValue) {
      const dayArray = state.data.map(day => { return { ...day } })
      dayArray[event.dayArrayIndex] = {
        ...state.data[event.dayArrayIndex],
        dayValue: event.newDayValue
      }
      return {
        ...state,
        data: dayArray
      }
    }
  } else if (event.type === "drag") {
    if (typeof event.dayArrayIndex === 'number'
      && event.newDayValue
      && typeof state.selectedEvent.arrayIndex === 'number') {
      const dayArray = state.data.map(day => { return { ...day } })
      dayArray[event.dayArrayIndex] = {
        ...state.data[event.dayArrayIndex],
        dayValue: event.newDayValue
      }
      return {
        ...state,
        data: dayArray,
        selectedEvent: {
          ...state.selectedEvent,
          duration:
            state.data[event.dayArrayIndex].dayValue[state.selectedEvent.arrayIndex].duration
        }
      }
    }
  } else if (event.type === "dragEnd") {
    if (typeof event.dayArrayIndex === 'number' && event.newDayValue) {
      const dayArray = state.data.map(day => { return { ...day } })
      dayArray[event.dayArrayIndex] = {
        ...state.data[event.dayArrayIndex],
        dayValue: event.newDayValue
      }
      return {
        ...state,
        data: dayArray
      }
    }
  }

  return state
}

export default reducer