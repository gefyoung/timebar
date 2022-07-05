
import { ChangeEvent, useRef, useState } from 'react'
import { Day, State } from '../../lib/types'


export default function Text({ day, dayIndex, dispatch, state }: {
  day: Day
  dayIndex: number
  dispatch: (event: any) => void
  state: State
}) {
  const isEvent = state.selectedEvent.eventName !== ""
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const changeText = (e: ChangeEvent<HTMLTextAreaElement>) => {

    dispatch({
      type: "changeText",
      text: e.target.value,
      dayArrayIndex: dayIndex,
      arrayIndex: isEvent && state.selectedEvent.arrayIndex
    })

  }

  return (
    <>
      <textarea
        key={"TextArea_" + state.selectedEvent.id}
        defaultValue={isEvent ? state.selectedEvent.text : ""}
        // value={isEvent ? state.selectedEvent.text?? "" : day.dayText?? ""}
        ref={textAreaRef}
        onChange={(e) => changeText(e)}
        className="
        form-control
        block
        w-full
        h-28
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        e.target.valuebg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
      ></textarea>
    </>
  )
}