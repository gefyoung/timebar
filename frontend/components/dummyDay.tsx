import { DragEvent, useEffect, useReducer, useState } from 'react'
import DummyText from './days/dummyText'
import Image from 'next/image'
import { State, Day } from '../lib/types'
import DummyNameBar from './days/dummyNameBar'
import DummyEventsBar from './days/dummyEventsBar'
import reducer from '../lib/daysReducer'
import EventsDelineator from './days/eventsDelineator'

// interface DummyState {

// }
type Reducer<S, A> = (prevState: S, action: A) => S

export default function DummyTimebar() {

const dateString = new Date().getDate()

  const initialState = {
    events: ['Code', 'Type 2 leisure', 'Type 1 leisure', 'Sleep'],
    data: [{
      dayKey: dateString,
      dayValue: [{
        id: "1",
        duration: 6,
        eventName: "Code",
        className: "col-span-6 h-8 bg-red-600",
        text: "hello",
        eventNameKey: 0,
        dayKey: dateString,
        arrayIndex: 0,
        dayArrayIndex: 0
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

  const dayClicked = (day: Day) => {
    if (state.selectedEvent.dayKey === day.dayKey) {
      dispatch({ type: 'deselectDay' })
    } else {
      dispatch({
        type: "selectDay",
        dayKey: day.dayKey
      })
    }
  }
  
  return (
    <div className="flex justify-center mt-10 ml-4">
      <div className="w-85ch">
        <div className="flex flex-row">
    
      
        </div>

        {
          state.data.map((day: Day, i: number) =>
            <div className="max-w-4xl mb-10" key={day.dayKey}>

              <div className="flex flex-row" >
                <div onClick={() => dayClicked(day)}>
                  {new Date().toLocaleString('en-us', { weekday: 'long' }) + " " + day.dayKey}
                </div>
              </div>
              {state.selectedEvent.dayKey === day.dayKey
                && <DummyNameBar
                  state={state}
                  day={day}
                  dispatch={dispatch}
                  monthYear={state.monthYear}
                  eventNames={state.events}
                  dayIndex={i}
                  
                />}
              {/* </div> */}

              <DummyEventsBar
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
                  <DummyText
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
