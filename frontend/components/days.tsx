import { useEffect, useState } from 'react'
import TextArea from './textArea'
import DayText from './dayText'
import Image from 'next/image'
import axios from 'axios'
import API from '@aws-amplify/api'
import '../configureAmplify'
import returnAdvancedWidth from '../lib/returnWidth'
import { FlipEvent, Day } from '../lib/types'
import { monthToString } from '../lib/convertMonthYear'

export default function Days({ data }: { data : any}) {

  console.log(data)

  const [selectedEventState, setSelectedEventState] = useState({
    flipEvent: {
      summary: "",
      text: "",
      start: 0
    },
    dayKey: 0,
    dayText: ""
  })

  const [monthState, setMonthState] = useState({
    month: '',
    year: 0,
    monthYear: ''
  })

  const [dataState, setDataState] = useState([{
    dayKey: '',
    dayValue: [{
      start: 0,
      duration: 0,
      summary: '',
      className: '',
      text: ''
    }],
    dayText: ''
  }])

  useEffect(() => {
    (async () => {
      try {
        const data = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME??"", '/getUserMonth', {})
        data.days.forEach((dayObj: Day) => {
          dayObj.dayValue = returnAdvancedWidth(dayObj.dayValue)
        })
        setDataState(data.days)
        const month = data.month.match(/(.*?)_/)
        const year = data.month.match(/_(.*)/)
        setMonthState({
          month: month[1],
          year: year[1],
          monthYear: data.month
        })
      } catch (err) {
        console.log('err', err)
      }
    })()
  }, [])


  const changeDayText = (text: string) => {
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
    setDataState(editedArray)
    // setSelectedEventState({...selectedEventState, dayText: text})
  }

  const changeText = (e: string, isDay: boolean) => {
    
    const editedArray = dataState
    dataState.forEach((dataDay, i) => {
      if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
        if (!isDay) {
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

        
        } else {
          const newDay = {
            ...dataDay,
            dayText: e
          }
          editedArray.splice(i, 1, newDay)
          
        }
      }
    })
    console.log('e', e)
    setDataState(editedArray)
  }

  const selectFlip = (flipEvent: FlipEvent, dayKey: number) => {
    console.log('selectflipstate-', selectedEventState)
    setSelectedEventState({
      flipEvent: {
        summary: flipEvent.summary,
        text: flipEvent.text ?? "",
        start: flipEvent.start
      },
      dayKey: Number(dayKey),
      dayText: selectedEventState.dayText
    })
  }

  const selectDay = (day: Day) => {
    console.log('dayclickstate-', selectedEventState)
    setSelectedEventState({
      flipEvent: {
        summary: "",
        text: selectedEventState.flipEvent.text ?? "",
        start: 0
      },
      dayKey: Number(day.dayKey),
      dayText: day.dayText ?? ""
    })
  }

  const FlipComponent = ({ flipEvent, dayKey }: { flipEvent: FlipEvent, dayKey: string }) => (
    <>
      <div
        key={flipEvent.start}
        className={flipEvent.className}
        onClick={() => selectFlip(flipEvent, Number(dayKey))}>
        {flipEvent.text && 
        <div className="h-4 mt-4"><Image width={16} height={16}  src="/files.svg" alt="notes icon" />
        </div>}
      </div>

    </>
  )

  const TimeBar = ({ day }: { day: Day }) => {
    const dayInteger = new Date(monthState.month + " " + day.dayKey + " " + monthState.year)

    return (
      <div className="max-w-4xl mb-10" key={day.dayKey}>

        <div className="flex flex-row" onClick={() => selectDay(day)} >
          { dayInteger.toLocaleString('en-us', { weekday: 'long' }) + " " + day.dayKey }
          {day.dayText && <div className="h-4 mt-2 ml-1">
            <Image width={16} height={16} src="/files.svg" alt="notes icon" />
            </div>}
        </div>

        <div className="grid grid-cols-96">
          {day.dayValue.map((flipEvent: FlipEvent) =>
            <FlipComponent key={flipEvent.start} dayKey={day.dayKey} flipEvent={flipEvent} />
          )}
        </div>

        <div>
          {selectedEventState.dayKey === parseInt(day.dayKey)
            && <FlipEditor />
          }
        </div>
      </div>
    )
  }

  const FlipEditor = () => {
    return (
      <div className='bg-gray-100'>
        {selectedEventState.flipEvent.summary !== ""
          ? <div>
            <div>{selectedEventState.flipEvent.summary}</div>
            <div>
              <TextArea changeText={changeText} flipState={selectedEventState} />
            </div>
          </div> : <div className="mt-6">
            <DayText changeDayText={changeDayText} flipState={selectedEventState} monthState={monthState}/>
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
            <TimeBar key={day.dayKey} day={day} />
          )
        }
      </div>
    </div>
  )
}
