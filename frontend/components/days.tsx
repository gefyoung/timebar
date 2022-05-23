import { DragEvent, useEffect, useReducer, useState } from 'react'
import EventText from './eventText'
import DayText from './dayText'
import Image from 'next/image'
import API from '@aws-amplify/api'

import returnClassName, { returnOneClassName } from '../lib/returnClassName'
import { Event, Day } from '../lib/types'
import { monthToString } from '../lib/convertMonthYear'
import EventNameBar from './days/eventNameBar'
import EventsBar from './days/eventsBar'
import { UserMonthData } from '../pages/index'

interface MonthType {
  month: string,
  year: number,
  monthYear: string,
  events: string[]
}

interface ReducerEvent {
  type: string
  dayKey: string
  text?: string
  event?: Event
  arrayIndex?: number
}

interface State {
  monthYear: string
  events: string[]
  data: Day[]
  selectedEvent: Event
  // {
  //   eventName: string
  //   text: string
  //   start: number
  //   arrayIndex: number
  //   duration: number
  //   dayKey: string
  // }
}

const reducer = (state: any, event: ReducerEvent) => {

  if (event.type === "selectEvent") {

    return { ...state,
      selectedEvent: {
        eventName: event.event?.eventName,
        text: event.event?.text ?? "",
        start: event.event?.start,
        // arrayIndex: event.arrayIndex,
        duration: event.event?.duration,
        dayKey: event.dayKey
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
        dayKey: event.dayKey,
        text: event.text
        // arrayIndex: 0
      }
    }


  } else if (event.type === "changeDayText" ) {
    const editedArray = [...state.data]
    console.log('cjsnhifdng')
    state.data.forEach((day, i) => {
      if (state.selectedEvent.dayKey === day.dayKey) {
        const newDay = {
          ...day,
          dayText: state.selectedEvent.text
        }
        editedArray.splice(i, 1, newDay)
      }
  })
    return(editedArray)



  } else if (event.type === "changeEventText") {
    const editedArray = dataState
    dataState.forEach((dataDay, i) => {
      if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
        const flipArray: Event[] = dataDay.dayValue

        dataDay.dayValue.forEach((flip, x) => {
          if (selectedEventState.flipEvent.start === flip.start) {
            const newFlip = {
              ...flip,
              text: e
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
  }

  return state
}

export default function Days({ data }: { data: UserMonthData }) {

  const initialState: State = {
    monthYear: data.month,
    events: data.events,
    data: data.days,
    selectedEvent: {
      eventName: "",
      text: "",
      start: 0,
      // arrayIndex: 0,
      duration: 0,
      dayKey: "0"
    }
  }


  const [state, dispatch] = useReducer(reducer, initialState)

  const [selectedEventState, setSelectedEventState] = useState({
    flipEvent: {
      eventName: "",
      text: "",
      start: 0,
      arrayIndex: 0,
      duration: 0
    },
    dayKey: 0,
    dayText: "",
  })

  const [monthState, setMonthState] = useState<MonthType>({
    month: '',
    year: 0,
    monthYear: '',
    events: []
  })

  const [dataState, setDataState] = useState([{
    dayKey: '',
    dayValue: [{
      start: 0,
      duration: 0,
      eventName: '',
      className: '',
      text: '',
      eventNameKey: 0
    }],
    dayText: ''
  }])

  const [dragState, setDragState] = useState({
    initialPosition: 1,
    size: 1
  })


  useEffect(() => {
    (async () => {
      const params = {
        body: {
          timezoneOffset: new Date().getTimezoneOffset()
        }
      }
      try {
        const data = await API.post(
          process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "",
          '/getUserMonth',
          params
        )
        data.days.forEach((dayObj: Day) => {
          dayObj.dayValue = returnClassName(dayObj.dayValue)
        })
        setDataState(data.days)
        const month = data.month.match(/(.*?)_/)
        const year = data.month.match(/_(.*)/)
        setMonthState({
          month: month[1],
          year: year[1],
          monthYear: data.month,
          events: data.events ?? []
        })
      } catch (err) {
        console.log('err', err)
      }
    })()
  }, [])

  // this does not work lol
  // const changeDayText = (text: string, dayKey: string) => {
  //   /* these change text functions are mutating state, if I have them set state, they do a state
  //   refresh every letter, which causes shit to deselct, or after save, still fucky*/

  //   const editedArray = dataState
  //   dataState.forEach((dataDay, i) => {
  //     if (selectedEventState.dayKey === Number(dataDay.dayKey)) {

  //       const newDay = {
  //         ...dataDay,
  //         dayText: text
  //       }
  //       editedArray.splice(i, 1, newDay)
  //     }
  //   })

  //   setDataState({ ...dataState })

  // }


  // const changeEventText = (e: string) => {
  //   const editedArray = dataState
  //   dataState.forEach((dataDay, i) => {
  //     if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
  //       const flipArray: Event[] = dataDay.dayValue

  //       dataDay.dayValue.forEach((flip, x) => {
  //         if (selectedEventState.flipEvent.start === flip.start) {
  //           const newFlip = {
  //             ...flip,
  //             text: e
  //           }
  //           flipArray.splice(x, 1, newFlip)
  //         }
  //       })

  //       const newDay = {
  //         ...dataDay,
  //         dayValue: flipArray
  //       }
  //       editedArray.splice(i, 1, newDay)

  //     }
  //   })
  //   // setDataState(editedArray)
  // }

  // const selectEvent = (flipEvent: Event, dayKey: number, i: number) => {
  //   console.log('selectflipstate-', selectedEventState)
  //   setSelectedEventState({
  //     ...selectedEventState,
  //     flipEvent: {
  //       ...flipEvent,
  //       eventName: flipEvent.eventName,
  //       text: flipEvent.text ?? "",
  //       start: flipEvent.start,
  //       arrayIndex: i,
  //       duration: flipEvent.duration
  //     },
  //     dayKey: Number(dayKey),

  //   })
  // }

  const eventNameAdded = (newEvent: string) => {
    setMonthState({
      ...monthState,
      events: monthState.events.concat([newEvent])
    })
  }


  const eventAdded = (event: any) => {
    const editedArray = [...dataState]

    dataState.forEach((dataDay, i) => {

      if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
        const newArray = dataDay.dayValue.concat([event])

        const newDay = {
          ...dataDay,
          dayValue: newArray
        }
        editedArray.splice(i, 1, newDay)
        setDataState(editedArray)
        console.log('editedArray', editedArray)
      }
    })
  }

  const eventDeleted = (event: any) => {
    const editedArray = [...dataState]

    editedArray.forEach(async (dataDay, i) => {

      if (selectedEventState.dayKey === Number(dataDay.dayKey)) {

        dataDay.dayValue.splice(selectedEventState.flipEvent.arrayIndex, 1)

        const params = {
          body: {
            dayKey: selectedEventState.dayKey,
            monthYear: monthState.monthYear,
            start: selectedEventState.flipEvent.start
          }
        }
        await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/deleteEvent', params)
        setDataState(editedArray)

        console.log('editedArray', editedArray)
      }
    })
  }

  // const selectDay = (day: Day) => {
  //   console.log('dayclickstate-', selectedEventState)
  //   setSelectedEventState({
  //     ...selectedEventState,
  //     flipEvent: {
  //       ...selectedEventState.flipEvent,
  //       eventName: "",
  //       text: selectedEventState.flipEvent.text ?? "",
  //       start: 0,
  //       arrayIndex: 0
  //     },
  //     dayKey: Number(day.dayKey),
  //     dayText: day.dayText ?? ""
  //   })
  // }

  const dragStart = (e: DragEvent, duration: number) => {
    console.log('dragStart', e)
    setDragState({ ...dragState, initialPosition: e.clientX })

  }
  const touchStart = (e: TouchEvent) => {
    console.log('touchStart', e)
    setDragState({ ...dragState, initialPosition: e.changedTouches[0].clientX })
  }
  const dragEnd = async (duration: number) => {
    console.log('dragEnd')

    const params = {
      body: {
        dayKey: selectedEventState.dayKey,
        monthYear: monthState.monthYear,
        start: selectedEventState.flipEvent.start,
        duration: duration,
      }
    }
    await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/saveDuration', params)

  }

  const drag = (e: DragEvent) => {
    const editedArray = [...dataState]
    const oneGridWidth = (document.getElementById("grid96")?.offsetWidth ?? 0) / 96
    const currentWidth = selectedEventState.flipEvent.duration * oneGridWidth
    const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
    let duration = 0

    if (e.clientX - 10 > currentWidth + boxLeftPosition) {
      /* if mouse moves right, add width */
      editedArray.forEach((dataDay, i) => {
        if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
          const flipArray: Event[] = dataDay.dayValue

          dataDay.dayValue.forEach((event, x) => {
            if (selectedEventState.flipEvent.start === event.start) {
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

      setDataState(editedArray)
      setSelectedEventState({
        ...selectedEventState,
        flipEvent: {
          ...selectedEventState.flipEvent,
          duration: duration
        }
      })


    } else if (e.clientX < currentWidth + boxLeftPosition) {
      editedArray.forEach((dataDay, i) => {
        if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
          const flipArray: Event[] = dataDay.dayValue

          dataDay.dayValue.forEach((event, x) => {
            if (selectedEventState.flipEvent.start === event.start) {
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
      setDataState(editedArray)
      setSelectedEventState({
        ...selectedEventState,
        flipEvent: {
          ...selectedEventState.flipEvent,
          duration: duration
        }
      })
    }



  }

  const touchMove = (e: any) => {
    const editedArray = [...dataState]
    const oneGridWidth = (document.getElementById("grid96")?.offsetWidth ?? 0) / 96
    const currentWidth = selectedEventState.flipEvent.duration * oneGridWidth
    const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
    let duration = 0

    if (e.changedTouches[0].clientX - 10 > currentWidth + boxLeftPosition) {
      /* if mouse moves right, add width */
      editedArray.forEach((dataDay, i) => {
        if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
          const flipArray: Event[] = dataDay.dayValue

          dataDay.dayValue.forEach((event, x) => {
            if (selectedEventState.flipEvent.start === event.start) {
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

      setDataState(editedArray)
      setSelectedEventState({
        ...selectedEventState,
        flipEvent: {
          ...selectedEventState.flipEvent,
          duration: duration
        }
      })

    } else if (e.changedTouches[0].clientX < currentWidth + boxLeftPosition) {
      editedArray.forEach((dataDay, i) => {
        if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
          const flipArray: Event[] = dataDay.dayValue

          dataDay.dayValue.forEach((event, x) => {
            if (selectedEventState.flipEvent.start === event.start) {
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
      setDataState(editedArray)
      setSelectedEventState({
        ...selectedEventState,
        flipEvent: {
          ...selectedEventState.flipEvent,
          duration: duration
        }
      })
    }
  }



  const TextEditor = () => {
    return (
      <div className='bg-gray-100'>
        {selectedEventState.flipEvent.eventName !== ""
          ? <div>
            <div>{selectedEventState.flipEvent.eventName}</div>
            <div>
              <EventText eventName={selectedEventState.flipEvent.eventName} changeEventText={changeEventText} flipState={selectedEventState} monthState={monthState} />
            </div>
          </div> : <div className="mt-6">
            <DayText dispatch={dispatch} selectedEvent={state.selectedEvent} monthState={monthState} />
          </div>
        }
      </div>
    )
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="w-85ch">
        <div className="mb-10 text-xl">{monthToString(Number(monthState.month))}  {monthState.year}</div>
        {
          state.data.map((day: Day ) =>
            <div className="max-w-4xl mb-10" key={day.dayKey}>

              <div className="flex flex-row" >
                <div onClick={() => dispatch({
                  type: "selectDay", 
                  dayKey: day.dayKey,
                  text: day.dayText
                  })}>
                  {
                  (new Date(monthState.month + " " + day.dayKey + " " + monthState.year))
                    .toLocaleString('en-us', { weekday: 'long' }) + " " + day.dayKey}
                </div>
                {day.dayText && <div className="h-4 mt-2 ml-1">
                  <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>}
              </div>
              <div>
                {state.selectedEvent.dayKey === parseInt(day.dayKey)
                  && <EventNameBar
                    eventNameAdded={eventNameAdded}
                    eventAdded={eventAdded}
                    monthYear={monthState.monthYear}
                    events={monthState.events}
                    dayKey={Number(day.dayKey)}
                    dayValue={day.dayValue}
                  />}
              </div>

              <EventsBar
                dispatch={dispatch}
                
                eventDeleted={eventDeleted}
                drag={drag}
                day={day}

                selectedEvent={state.selectedEvent}
                dragStart={dragStart}
                dragEnd={dragEnd}
                touchMove={touchMove}
              />


              <div>
                {state.selectedEvent.dayKey === day.dayKey
                  && <TextEditor />
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
