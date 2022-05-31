import { Day, Event } from "./types"
import { API } from '@aws-amplify/api'
import { DragEvent } from "react"
import { returnOneClassName } from '../lib/returnClassName'
interface MonthType {
  month: string,
  year: number,
  monthYear: string,
  events: string[]
}

interface ReducerEvent {
  type: string
  dayKey?: string
  text?: string
  event?: Event
  arrayIndex?: number
  eventName?: string
  dragEvent?: DragEvent
  distanceToFront?: number
}

export interface State {
  monthYear: string
  events: string[]
  data: {
    dayKey: string
    dayValue: {
      start: number
      duration: number
      eventName: string
      className: string
      text?: string
      eventNameKey?: number
      dayKey: string
      arrayIndex: number
    }[]
    dayText?: string
  }[]
  selectedEvent: {
    start: number
    dayKey: string
    duration: number
    eventName: string
    className?: string
    text?: string
    eventNameKey?: number
    arrayIndex: number
  }
}

interface DayValueDay {
  start: number;
  duration: number;
  eventName: string;
  className: string;
  text?: string | undefined;
  eventNameKey?: number | undefined;
  dayKey: string;
  arrayIndex: number;
}



const reducer = (state: State, event: ReducerEvent): State => {

  if (event.type === "selectEvent") {

    return {
      ...state,
      selectedEvent: {
        eventName: event.event?.eventName ?? "",
        text: event.event?.text ?? "",
        start: event.event?.start ?? 0,
        arrayIndex: event.arrayIndex ?? 0,
        duration: event.event?.duration ?? 0,
        dayKey: event.dayKey ?? "0"
      }
    }


  } else if (event.type === "selectDay") {
    console.log('event', event)
    return {
      ...state,
      selectedEvent: {
        ...state.selectedEvent,
        eventName: "",
        start: 0,
        dayKey: event.dayKey ?? "0",
        text: event.text
      }
    }


    // this mutates
  } else if (event.type === "changeDayText") {
    const editedArray = state.data
    state.data.forEach((day, i) => {
      if (state.selectedEvent.dayKey === day.dayKey) {
        console.log('hello', event.text)
        const newDay = {
          ...day,
          dayText: event.text
        }
        editedArray.splice(i, 1, newDay)
      }
    })


    // this mutates
  } else if (event.type === "changeEventText") {

    const editedArray = state.data
    state.data.forEach((dataDay, i) => {
      if (state.selectedEvent.dayKey === dataDay.dayKey) {
        const flipArray: Event[] = dataDay.dayValue

        dataDay.dayValue.forEach((flip, x) => {
          if (state.selectedEvent.start === flip.start) {
            const newFlip = {
              ...flip,
              text: event.text
            }
            flipArray.splice(x, 1, newFlip)
          }
        })

        const newDay = {
          ...dataDay,
          dayValue: flipArray
        }
        editedArray.splice(i, 1, newDay)

      }
    })



  } else if (event.type === "eventNameAdded") {
    return {
      ...state,
      events: state.events.concat([event.event?.eventName ?? ""])
    }




  } else if (event.type === "eventAdded") {

    const editedArray = [...state.data]
    state.data.forEach((dataDay, i) => {

      if (state.selectedEvent.dayKey === "" + dataDay.dayKey) {

        if (event.event) {
          const newArray = dataDay.dayValue.concat([event.event])

          const newDay = {
            ...dataDay,
            dayValue: newArray
          }
          editedArray.splice(i, 1, newDay)

        }

      }


    })

    return { ...state, data: editedArray }



  } else if (event.type === "eventDeleted") {

    const editedArray = [...state.data]

    let params = { body: {} }

    editedArray.forEach(async (dataDay, i) => {

      if (state.selectedEvent.dayKey === dataDay.dayKey) {

        dataDay.dayValue.splice(state.selectedEvent.arrayIndex, 1)

      }
    })


    return { ...state, data: editedArray }


  } else if (event.type === "drag") {
    const editedArray = [...state.data]
    const oneGridWidth = (document.getElementById("grid96")?.offsetWidth ?? 0) / 96
    const currentWidth = state.selectedEvent.duration * oneGridWidth
    const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
    let duration = 0
    console.log('oneGrid', oneGridWidth, 'currentWidth', currentWidth, 'boxLeftPosition', boxLeftPosition)

    if (event.dragEvent) {
      if (event.dragEvent.clientX - 10 > currentWidth + boxLeftPosition) {
        /* if mouse moves right, add width */
        editedArray.forEach((dataDay, i) => {
          if (state.selectedEvent.dayKey === dataDay.dayKey) {
            const flipArray: Event[] = dataDay.dayValue

            dataDay.dayValue.forEach((event, x) => {
              if (state.selectedEvent.start === event.start) {
                duration = event.duration + 1
                const newEvent = {
                  ...event,
                  duration: event.duration + 1,
                  className: returnOneClassName(event)
                }
                flipArray.splice(x, 1, newEvent)
              }
            })

            const newDay = {
              ...dataDay,
              dayValue: flipArray
            }
            editedArray.splice(i, 1, newDay)

          }
        })

        return {
          ...state,
          data: editedArray,
          selectedEvent: {
            ...state.selectedEvent,
            duration: duration
          }
        }


      } else if (event.dragEvent.clientX < currentWidth + boxLeftPosition) {
        editedArray.forEach((dataDay, i) => {
          if (state.selectedEvent.dayKey === dataDay.dayKey) {
            const flipArray: Event[] = dataDay.dayValue

            dataDay.dayValue.forEach((event, x) => {
              if (state.selectedEvent.start === event.start) {
                duration = event.duration - 1
                const newEvent = {
                  ...event,
                  duration: event.duration - 1,
                  className: returnOneClassName(event)
                }
                flipArray.splice(x, 1, newEvent)
              }
            })

            const newDay = {
              ...dataDay,
              dayValue: flipArray
            }
            editedArray.splice(i, 1, newDay)

          }
        })
        return {
          ...state,
          data: editedArray,
          selectedEvent: {
            ...state.selectedEvent,
            duration: duration
          }
        }
      }
    }


  } else if (event.type === "moved") { // if event moved left

    const editedArray = [...state.data]

    let daySelectedEvent: Event = {
      eventName: "",
      text: "",
      start: 0,
      className: "",
      arrayIndex: 0,
      duration: 0,
      dayKey: "0"
    }
    let x: number
    let nearestEvent: Event
    let newEventArray: any[] = []
    let moved = false
    let movingDayValueEvent: any
    // if (event.dragEvent && event.distanceToFront) {
    //   const movingFront = event.dragEvent.clientX - event.distanceToFront

      // editedArray.forEach((day) => {

      //   if (state.selectedEvent.dayKey === day.dayKey) {
      //     const greaterThanArray: Event[] = []
      //     movingDayValueEvent = day.dayValue[state.selectedEvent.arrayIndex] // this works

      //     day.dayValue.forEach((eventBox, i) => {
      //       const currPosition = document.getElementById(`${eventBox.start}`)?.offsetLeft ?? 0
      //       // console.log('currentPosition: ', currPosition, ', movingFront: ', movingFront, 'event', eventBox)
      //       if (!moved) {
      //         if (currPosition < movingFront) {
      //           eventBox.start = movingDayValueEvent.duration + eventBox.start
      //           newEventArray.push(eventBox)
                
      //         } else {
      //           movingDayValueEvent.start = eventBox.start
      //           console.log('eventBox.start', eventBox.start)
      //           eventBox.start = state.selectedEvent.duration + eventBox.start // not using movingDay cause error
      //           console.log('state.selectedEvent.duration + eventBox.start', state.selectedEvent.duration,  eventBox.start)
      //           newEventArray.push(movingDayValueEvent, eventBox)
                
      //           moved = true
      //         }
      //       } else {
      //         if (movingDayValueEvent.start !== eventBox.start) {
      //           eventBox.start = movingDayValueEvent.duration + eventBox.start
      //           newEventArray.push(eventBox)
      //         }
              
      //       }

      //     })
      //   day.dayValue = newEventArray
      //   movingDayValueEvent.dayKey = day.dayKey
      //   }
      // })
      // console.log('newEventArray', newEventArray)


    // }
    // console.log('editedArray', editedArray)
    return {
      ...state,
      data: editedArray,
      selectedEvent: movingDayValueEvent
      
    }

  }

  return state
}

export default reducer










// const touchMove = (e: any) => {
//   const editedArray = [...dataState]
//   const oneGridWidth = (document.getElementById("grid96")?.offsetWidth ?? 0) / 96
//   const currentWidth = state.selectedEvent.duration * oneGridWidth
//   const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
//   let duration = 0

//   if (e.changedTouches[0].clientX - 10 > currentWidth + boxLeftPosition) {
//     /* if mouse moves right, add width */
//     editedArray.forEach((dataDay, i) => {
//       if (state.selectedEvent.dayKey === Number(dataDay.dayKey)) {
//         const flipArray: Event[] = dataDay.dayValue

//         dataDay.dayValue.forEach((event, x) => {
//           if (state.selectedEvent.start === event.start) {
//             duration = event.duration + 1
//             const newEvent = {
//               ...event,
//               duration: event.duration + 1,
//               className: returnOneClassName(event)
//             }
//             flipArray.splice(x, 1, newEvent)
//           }
//         })

//         const newDay = {
//           ...dataDay,
//           dayValue: flipArray
//         }
//         editedArray.splice(i, 1, newDay)

//       }
//     })

//     setDataState(editedArray)
//     setSelectedEventState({
//       ...state.selectedEvent,
//       flipEvent: {
//         ...state.selectedEvent,
//         duration: duration
//       }
//     })

//   } else if (e.changedTouches[0].clientX < currentWidth + boxLeftPosition) {
//     editedArray.forEach((dataDay, i) => {
//       if (state.selectedEvent.dayKey === Number(dataDay.dayKey)) {
//         const flipArray: Event[] = dataDay.dayValue

//         dataDay.dayValue.forEach((event, x) => {
//           if (state.selectedEvent.start === event.start) {
//             duration = event.duration - 1
//             const newEvent = {
//               ...event,
//               duration: event.duration - 1,
//               className: returnOneClassName(event)
//             }
//             flipArray.splice(x, 1, newEvent)
//           }
//         })

//         const newDay = {
//           ...dataDay,
//           dayValue: flipArray
//         }
//         editedArray.splice(i, 1, newDay)

//       }
//     })
//     setDataState(editedArray)
//     setSelectedEventState({
//       ...state.selectedEvent,
//       flipEvent: {
//         ...state.selectedEvent,
//         duration: duration
//       }
//     })
//   }
// }