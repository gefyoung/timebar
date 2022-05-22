import { DragEvent, useEffect, useState } from 'react'
import EventText from './eventText'
import DayText from './dayText'
import Image from 'next/image'
import API from '@aws-amplify/api'

import returnClassName, { returnOneClassName } from '../lib/returnClassName'
import { FlipEvent, Day } from '../lib/types'
import { monthToString } from '../lib/convertMonthYear'
import EventNameBar from './days/eventNameBar'
import EventsBar from './days/eventsBar'

interface MonthType {
  month: string,
  year: number,
  monthYear: string,
  events: string[]
}

export default function Days({ data }: { data: any }) {

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
      const params = { body: {
        timezoneOffset: new Date().getTimezoneOffset()
      }}
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


  const changeDayText = (text: string, dayKey: string) => {
    /* these change text functions are mutating state, if I have them set state, they do a state
    refresh every letter, which causes shit to deselct, or after save, still fucky*/

    const editedArray = dataState
    dataState.forEach((dataDay, i) => {
      if (selectedEventState.dayKey === Number(dataDay.dayKey)) {

        const newDay = {
          ...dataDay,
          dayText: text
        }
        editedArray.splice(i, 1, newDay)
      }
    })

    setDataState({...dataState})

  }


  const changeEventText = (e: string) => {
    const editedArray = dataState
    dataState.forEach((dataDay, i) => {
      if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
        const flipArray: FlipEvent[] = dataDay.dayValue

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
    // setDataState(editedArray)
  }

  const selectEvent = (flipEvent: FlipEvent, dayKey: number, i: number) => {
    console.log('selectflipstate-', selectedEventState)
    setSelectedEventState({
      ...selectedEventState,
      flipEvent: { ...flipEvent,
        eventName: flipEvent.eventName,
        text: flipEvent.text ?? "",
        start: flipEvent.start,
        arrayIndex: i,
        duration: flipEvent.duration
      },
      dayKey: Number(dayKey),

    })
  }

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

    editedArray.forEach( async (dataDay, i) => {

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

  const selectDay = (day: Day) => {
    console.log('dayclickstate-', selectedEventState)
    setSelectedEventState({
      ...selectedEventState,
      flipEvent: { ...selectedEventState.flipEvent,
        eventName: "",
        text: selectedEventState.flipEvent.text ?? "",
        start: 0,
        arrayIndex: 0
      },
      dayKey: Number(day.dayKey),
      dayText: day.dayText ?? ""
    })
  }

  const dragStart = (e: DragEvent, duration: number) => {
    console.log('dragStart', e)
    setDragState({...dragState, initialPosition: e.clientX })

  }
  const touchStart = (e: TouchEvent) => {
    console.log('touchStart', e)
    setDragState({...dragState, initialPosition: e.changedTouches[0].clientX })
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
    const oneGridWidth = (document.getElementById("grid96")?.offsetWidth?? 0) / 96
    const currentWidth = selectedEventState.flipEvent.duration * oneGridWidth
    const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
    let duration = 0

    if (e.clientX - 10 > currentWidth + boxLeftPosition) {
      /* if mouse moves right, add width */
      editedArray.forEach((dataDay, i) => {
        if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
          const flipArray: FlipEvent[] = dataDay.dayValue
  
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
          const flipArray: FlipEvent[] = dataDay.dayValue
  
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
    const oneGridWidth = (document.getElementById("grid96")?.offsetWidth?? 0) / 96
    const currentWidth = selectedEventState.flipEvent.duration * oneGridWidth
    const boxLeftPosition = document.getElementById("selectedEventBox")?.offsetLeft ?? 0
    let duration = 0

    if (e.changedTouches[0].clientX - 10 > currentWidth + boxLeftPosition) {
      /* if mouse moves right, add width */
      editedArray.forEach((dataDay, i) => {
        if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
          const flipArray: FlipEvent[] = dataDay.dayValue
  
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
          const flipArray: FlipEvent[] = dataDay.dayValue
  
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
            <DayText changeDayText={changeDayText} flipState={selectedEventState} monthState={monthState} />
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
          dataState.map((day) =>
            <div className="max-w-4xl mb-10" key={day.dayKey}>

              <div className="flex flex-row" >
                <div onClick={() => selectDay(day)}>
                  {(new Date(monthState.month + " " + day.dayKey + " " + monthState.year)).toLocaleString('en-us', { weekday: 'long' }) + " " + day.dayKey}
                </div>
                {day.dayText && <div className="h-4 mt-2 ml-1">
                  <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>}
              </div>
              <div>
                {selectedEventState.dayKey === parseInt(day.dayKey)
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
                  eventDeleted={eventDeleted} 
                  drag={drag} 
                  day={day} 
                  selectEvent={selectEvent} 
                  selectedEvent={selectedEventState} 
                  dragStart={dragStart}
                  dragEnd={dragEnd}
                  touchMove={touchMove}
                />
              

              <div>
                {selectedEventState.dayKey === parseInt(day.dayKey)
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
