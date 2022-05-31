// import { Day } from "./types"

// export const moveEnd = (e: DragEvent, day: Day, initialMoveState: number, state: any, dispatch: (
//   {type, newData, movingDayValueEvent}: {type: any, newData: any, movingDayValueEvent: any}) => void) => {
//   const movingFront = e.clientX - initialMoveState
//   let newEventArray: any[] = []
//   let moved = false
//   let movingDayValueEvent: any
//   movingDayValueEvent = day.dayValue[state.selectedEvent.arrayIndex] // this works

//   day.dayValue.forEach((eventBox, i) => {
//     const currPosition = document.getElementById(`${eventBox.start}`)?.offsetLeft ?? 0
//     // console.log('currentPosition: ', currPosition, ', movingFront: ', movingFront, 'event', eventBox)
//     if (!moved) {
//       if (currPosition < movingFront) {
//         eventBox.start = movingDayValueEvent.duration + eventBox.start
//         newEventArray.push(eventBox)

//       } else {
//         movingDayValueEvent.start = eventBox.start
//         console.log('eventBox.start', eventBox.start)
//         eventBox.start = state.selectedEvent.duration + eventBox.start // not using movingDay cause error
//         console.log('state.selectedEvent.duration + eventBox.start', state.selectedEvent.duration, eventBox.start)
//         newEventArray.push(movingDayValueEvent, eventBox)

//         moved = true
//       }
//     } else {
//       if (movingDayValueEvent.start !== eventBox.start) {
//         eventBox.start = movingDayValueEvent.duration + eventBox.start
//         newEventArray.push(eventBox)
//       }

//     }

//   })

//   day.dayValue = newEventArray
//   movingDayValueEvent.dayKey = day.dayKey
//   state.data.forEach((dataDay) => {
//     if (dataDay.dayKey === state.selectedEvent.dayKey) {
//       dataDay = day
//     }
//   })
//   dispatch({ type: "moved", newData: state.data, movingDayValueEvent: movingDayValueEvent })

// }