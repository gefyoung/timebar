import { API } from '@aws-amplify/api'
import { Autosave } from 'react-autosave'
import { useRef, useState } from 'react'

interface FlipState {

  eventName: string
  text: string
  start: number
  dayKey: string
  duration: number
}

interface SelectedEvent {
  dayKey: string
  start: number
  text?: string
  dayText?: string
}

export default function DayText({ selectedEvent, dispatch, monthState }: {
  selectedEvent: SelectedEvent
  dispatch: ({ text, type, dayKey }: { text: string, type: string, dayKey: string }) => void
  monthState: string
}) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [savedState, setSavedState] = useState("")
  const saveText = async (text: string | undefined) => {
    /* This is purposely object oriented because I cannot depend on the flipState for text as it causes a rerender
    and thus the textArea is deselected; I use useRef but if I define flip outside of saveText, dayText is stale */
    console.log(monthState, 'monthState')
    if (text) {
      const params = {
        body: {
          dayKey: selectedEvent.dayKey,
          start: selectedEvent.start,
          text: textAreaRef.current?.value,
          monthYear: monthState
        }
      }
      console.log('savetext', text)
      try {
        const res = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/saveText', params)
        console.log('res', res)

        setSavedState("saved")
      } catch {
        setSavedState("failed")
      }
    }

  }

  return (
    <>
      <textarea
        defaultValue={selectedEvent.text}
        ref={textAreaRef}
        onChange={(e) => {
          dispatch({ type: "changeDayText", text: e.target.value, dayKey: selectedEvent.dayKey })
          setSavedState("")
        }}
        className="
        form-control
        block
        w-full
        h-24
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
        onClick={() => saveText(textAreaRef.current?.value)}
      >save</button>
      {savedState === "saved" && "✔️"}
      {savedState === "failed" && "❌"}
    </>
  )
}