import { API } from '@aws-amplify/api'
import { ChangeEvent, useRef, useState } from 'react'
import { Day, State } from '../lib/types'


export default function Text({ day, dayIndex, dispatch, state }: {
  day: Day
  dayIndex: number
  dispatch: (event: any) => void
  state: State
}) {
  const isEvent = state.selectedEvent.eventName !== ""
  // const textAreaRef = useRef<HTMLTextAreaElement>(null)
 
  // if (textAreaRef.current) {
  //   textAreaRef.current.value = state.selectedEvent.text?? ""
  // }
  

  const [savedState, setSavedState] = useState("")


  const saveText = async () => {
    /* This is purposely object oriented because I cannot depend on the flipState for text as it causes a rerender
    and thus the textArea is deselected; I use useRef but if I define flip outside of saveText, dayText is stale */

      const params = !isEvent ? {
        body: {
          dayKey: state.selectedEvent.dayKey,
          start: state.selectedEvent.start,
          text: isEvent ? state.selectedEvent.text : day.dayText !== "" ? day.dayText : "",
          monthYear: state.monthYear
        }
      } : {
        body: {
          dayKey: state.selectedEvent.dayKey,
          start: state.selectedEvent.start,
          text: isEvent ? state.selectedEvent.text : day.dayText !== "" ? day.dayText : "",
          monthYear: state.monthYear,
          eventName: state.selectedEvent.eventName
        }
      }
      try {
        const res = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/saveText', params)
        setSavedState("saved")
      } catch {
        setSavedState("failed")
      }

  }

  const changeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // console.log(e.target.value)
    dispatch({
      type: "changeText",
      text: e.target.value,
      dayArrayIndex: dayIndex,
      arrayIndex: isEvent && state.selectedEvent.arrayIndex
    })
    setSavedState("")
  }

  return (
    <>
      <textarea
        key={dayIndex + " " + state.selectedEvent.start}
        defaultValue={isEvent ? state.selectedEvent.text : day.dayText !== "" ? day.dayText : ""}
        // value={isEvent ? state.selectedEvent.text?? "" : day.dayText?? ""}
        // ref={textAreaRef}
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
      < button
        className="px-1 m-1 mr-2 outline-black outline outline-1"
        onClick={() => saveText()}
      >save</button>
      {savedState === "saved" && "✔️"}
      {savedState === "failed" && "❌"}
    </>
  )
}