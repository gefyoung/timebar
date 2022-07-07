import { DragEvent, useEffect, useReducer, useState } from 'react'
import DummyText from './days/dummyText'
import Image from 'next/image'
import { State, Day } from '../lib/types'
import DummyNameBar from './days/dummyNameBar'
import DummyEventsBar from './days/dummyEventsBar'
import reducer from '../lib/daysReducer'
import EventsDelineator from './days/eventsDelineator'
import CustomSpinner from './customSpinner'

// interface DummyState {

// }
type Reducer<S, A> = (prevState: S, action: A) => S

export default function DummyTimebar(pageState: any) {

const dateString = new Date().getDate()

  const initialState = {
    events: ['Coding', 'Youtube', 'TikTok', 'Exercising'],
    data: [{
      dayKey: dateString,
      dayValue: [{
        id: "1",
        duration: 8,
        eventName: "Code",
        className: "col-span-8 h-8 bg-blue-600",
        text: "hello, I write my thoughts here",
        eventNameKey: 0,
        dayKey: dateString,
        arrayIndex: 0,
        dayArrayIndex: 0
      },
      {
        id: "2",
        duration: 6,
        eventName: "Youtube",
        className: "col-span-6 h-8 bg-red-600",
        text: "I've created general categories to give my notes context",
        eventNameKey: 1,
        dayKey: dateString,
        arrayIndex: 1,
        dayArrayIndex: 0
      },
      {
        id: "3",
        duration: 12,
        eventName: "Tiktok",
        className: "col-span-12 h-8 bg-pink-500",
        text: "I use the time bar below the activity to give it even more context",
        eventNameKey: 2,
        dayKey: dateString,
        arrayIndex: 2,
        dayArrayIndex: 0
      }
    ]}
  ],
    selectedEvent: {
      eventName: "Type 2",
      text: "hello, I write my thoughts here",
      id: "1",
      className: "col-span-6 h-8 bg-blue-600",
      arrayIndex: 0,
      duration: 6,
      dayKey: dateString,
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
