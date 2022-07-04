import { DragEvent, useEffect, useReducer, useState } from 'react'
import Text from './text'
import Image from 'next/image'
import { State, Day } from '../lib/types'
import { monthToString } from '../lib/convertMonthYear'
import EventNameBar from './days/eventNameBar'
import EventsBar from './days/eventsBar'
import { UserMonthData } from '../pages/index'
import reducer from '../lib/daysReducer'
import EventsDelineator from './days/eventsDelineator'

// interface DummyState {

// }
type Reducer<S, A> = (prevState: S, action: A) => S

export default function DummyTimebar() {

const dateString = new Date().toLocaleString('en-us', { weekday: 'long' }) + " " + new Date().getDay()
  console.log('dateString', dateString)
  const initialState = {
    events: ['Code', 'Type 2 leisure', 'Type 1 leisure', 'Sleep'],
    data: [{
      dayKey: dateString,
      dayValue: [{
        
      }]
    }],
    selectedEvent: {
      eventName: "",
      text: "",
      id: "",
      className: "",
      arrayIndex: 0,
      duration: 0,
      dayKey: "0",
      dayArrayIndex: 0
    }
  }


  const [state, dispatch] = useReducer<Reducer<any, any>>(reducer, initialState)

  const month = data.month.match(/(.*?)_/)
  const year = data.month.match(/_(.*)/)

  const month1 = month![1]
  const year1 = year![1]

  const dayClicked = (day: Day) => {
    if (state.selectedEvent.dayKey === day.dayKey) {
      dispatch({ type: 'deselectDay' })
    } else {
      dispatch({
        type: "selectDay",
        dayKey: day.dayKey,
        text: day.dayText,
      })
    }
  }
  
  return (
    <div className="flex justify-center mt-10 ml-4">
      <div className="w-85ch">
        <div className="flex flex-row">
        
        <div className="mb-10 text-xl">
        <Image onClick={getPreviousMonth} width={12} height={12} src="/leftArrow.svg" alt="previous month" />
          {monthToString(Number(month1))}  {year1 + " "}
        {/* <Image width={12} height={12} src="/rightArrow.svg" alt="next month" /> */}
        </div>
        
        </div>

        {
          state.data.map((day: Day, i: number) =>
            <div className="max-w-4xl mb-10" key={day.dayKey}>

              <div className="flex flex-row" >
                <div onClick={() => dayClicked(day)}>
                  {
                    (new Date(month1 + "/" + day.dayKey + "/" + year1))
                      .toLocaleString('en-us', { weekday: 'long' }) + " " + day.dayKey}
                </div>
                {day.dayText && <div className="h-4 mt-2 ml-1">
                  <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>}
              </div>
              {/* <div> */}
              {state.selectedEvent.dayKey === day.dayKey
                && <EventNameBar
                  state={state}
                  day={day}
                  dispatch={dispatch}
                  monthYear={state.monthYear}
                  eventNames={state.events}
                  dayIndex={i}
                  
                />}
              {/* </div> */}

              <EventsBar
                state={state}
                dispatch={dispatch}
                dayIndex={i}
              />
              {state.selectedEvent.dayKey === day.dayKey &&
                <EventsDelineator />
              }
              <div>
                {state.selectedEvent.dayKey === day.dayKey
                  &&           <div className="mt-6">
                  {
                  state.selectedEvent.eventName !== "" 
                    && <div><div>{state.selectedEvent.eventName}</div>
                  <Text
                    day={day}
                    state={state}
                    dayIndex={i}
                    dispatch={dispatch}
                  /></div>}
                </div>
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
