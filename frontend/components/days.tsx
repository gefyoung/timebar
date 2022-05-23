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
import reducer from '../lib/daysReducer'

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
}
type Reducer<S, A> = (prevState: S, action: A) => S

export default function Days({ data }: { data: UserMonthData }) {

  const initialState: State = {
    monthYear: data.month,
    events: data.events,
    data: data.days,
    selectedEvent: {
      eventName: "",
      text: "",
      start: 0,
      className: "",
      arrayIndex: 0,
      duration: 0,
      dayKey: "0"
    }
  }


  const [state, dispatch] = useReducer<Reducer<any, any>>(reducer, initialState)

  const month= data.month.match(/(.*?)_/)
  const year = data.month.match(/_(.*)/)
  const month1 = month[1]
  const year1 = year[1]


  const TextEditor = () => {
    return (
      <div className='bg-gray-100'>
        {state.selectedEvent.eventName !== ""
          ? <div>
            <div>{state.selectedEvent.eventName}</div>
            <div>
              <EventText 
                eventName={state.selectedEvent.eventName} 
                dispatch={dispatch} 
                selectedEvent={state.selectedEvent} 
                monthState={state.monthState} />
            </div>
          </div> : <div className="mt-6">
            <DayText 
              dispatch={dispatch} 
              selectedEvent={state.selectedEvent} 
              monthState={state.monthState} />
          </div>
        }
      </div>
    )
  }
  console.log('month', month, 'year', year)
  return (
    <div className="flex justify-center mt-10">
      <div className="w-85ch">
        <div className="mb-10 text-xl">{monthToString(Number(month1))}  {year1}</div>
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
                    
                  (new Date(month1 + " " + day.dayKey + " " + year1))
                    .toLocaleString('en-us', { weekday: 'long' }) + " " + day.dayKey}
                </div>
                {day.dayText && <div className="h-4 mt-2 ml-1">
                  <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>}
              </div>
              <div>
                {state.selectedEvent.dayKey === day.dayKey
                  && <EventNameBar
                    dispatch={dispatch}
                    monthYear={state.monthYear}
                    events={state.events}
                    dayKey={Number(day.dayKey)}
                    dayValue={day.dayValue}
                  />}
              </div>

              <EventsBar
                dispatch={dispatch}
                day={day}
                selectedEvent={state.selectedEvent}
                state={state}
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
