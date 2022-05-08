import { useEffect, useState } from 'react'
import EventText from './eventText'
import DayText from './dayText'
import Image from 'next/image'
import axios from 'axios'
import API from '@aws-amplify/api'

import returnClassName from '../lib/returnClassName'
import { FlipEvent, Day } from '../lib/types'
import { monthToString } from '../lib/convertMonthYear'
import EventBar from './days/eventBar'

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
      arrayIndex: 0
    },
    dayKey: 0,
    dayText: "",
    // addEvent: false
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
      eventKey: 0
    }],
    dayText: ''
  }])


  useEffect(() => {
    (async () => {
      try {
        const data = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/getUserMonth', {})
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


  const changeDayText = (text: string) => {
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
    // setDataState(editedArray)
  }


  const changeText = (e: string) => {
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
      flipEvent: {
        eventName: flipEvent.eventName,
        text: flipEvent.text ?? "",
        start: flipEvent.start,
        arrayIndex: i
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
        // const newArray = dataDay.dayValue.concat([event])

        // const newDay = {
        //   ...dataDay,
        //   dayValue: newArray
        // }
        // editedArray.splice(i, 1, newDay)
        const params = {
          body: {
            dayKey: selectedEventState.dayKey,
            monthYear: monthState.monthYear,
            start: selectedEventState.flipEvent.start
          }
        }
        await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/deleteEvent', params)
        setDataState(editedArray)
        // trying to set selectedevent to previous event after delete
        // setSelectedEventState(
        //   {...selectedEventState,
        //    flipEvent: {
        //     eventName: editedArray[editedArray.length - 1].dayValue.eventName,
        //     text: "",
        //     start: 0,
        //     arrayIndex: 0
        //   }
        //    })
           
        console.log('editedArray', editedArray)
      }
    })
  }

  const selectDay = (day: Day) => {
    console.log('dayclickstate-', selectedEventState)
    setSelectedEventState({
      ...selectedEventState,
      flipEvent: {
        eventName: "",
        text: selectedEventState.flipEvent.text ?? "",
        start: 0,
        arrayIndex: 0
      },
      dayKey: Number(day.dayKey),
      dayText: day.dayText ?? ""
    })
  }

  const EventComponent = ({ flipEvent, dayKey, i }: { flipEvent: FlipEvent, dayKey: string, i: number }) => (
    <>
      {selectedEventState.flipEvent.start === flipEvent.start 
      && selectedEventState.dayKey === parseInt(dayKey) ?
        <div
          key={flipEvent.start}
          className={flipEvent.className + " border-black border-2"}
          onClick={() => selectEvent(flipEvent, Number(dayKey), i)}
        >
          {
            flipEvent.text &&
            <div className="h-4 mt-4"><Image width={16} height={16} src="/files.svg" alt="notes icon" />
            </div>
          }
        </div>

        : <div
          key={flipEvent.start}
          className={flipEvent.className}
          onClick={() => selectEvent(flipEvent, Number(dayKey), i)}
        >
          {
            flipEvent.text &&
            <div className="h-4 mt-4"><Image width={16} height={16} src="/files.svg" alt="notes icon" />
            </div>
          }
        </div>
      }
    </>
  )

  const TextEditor = () => {
    return (
      <div className='bg-gray-100'>
        {selectedEventState.flipEvent.eventName !== ""
          ? <div>
            <div>{selectedEventState.flipEvent.eventName}</div>
            <div>
              <EventText eventName={selectedEventState.flipEvent.eventName} changeText={changeText} flipState={selectedEventState} monthState={monthState} />
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
                  && <EventBar
                    eventNameAdded={eventNameAdded}
                    eventAdded={eventAdded}
                    monthYear={monthState.monthYear}
                    events={monthState.events}
                    dayKey={Number(day.dayKey)}
                    dayValue={day.dayValue}
                  />}
              </div>

              <div className="grid grid-cols-96">
                {day.dayValue.map((flipEvent: FlipEvent, i: number) =>
                  <EventComponent i={i} key={flipEvent.start} dayKey={day.dayKey} flipEvent={flipEvent} />
                )}
                {selectedEventState.dayKey === parseInt(day.dayKey)
                  && <button
                   className="ml-2"
                   onClick={eventDeleted}
                  >delete</button>}
              </div>

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
