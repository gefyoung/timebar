import { API } from '@aws-amplify/api'
import { Autosave } from 'react-autosave'
import { useRef, useState } from 'react'

interface FlipState {
  flipEvent: {
    eventName: string,
    text: string,
    start: number
  },
  dayKey: number,
  dayText: string
}

interface Flip {
  dayKey: number
  start: number
  text?: string
  dayText?: string
}

export default function DayText({ flipState, changeDayText, monthState }: {
  flipState: FlipState
  changeDayText: (e: string) => void
  monthState: { month: string, year: number, monthYear: string }
}) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [savedState, setSavedState] = useState("")

  const saveText = async (text: string | undefined) => {
    /* This is purposely object oriented because I cannot depend on the flipState for text as it causes a rerender
    and thus the textArea is deselected; I use useRef but if I define flip outside of saveText, dayText is stale */
    if (text) {
      const params = { body: {
        dayKey: flipState.dayKey,
        start: flipState.flipEvent.start,
        text: textAreaRef.current?.value,
        monthYear: monthState.monthYear
      }}
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
        defaultValue={flipState.dayText}
        ref={textAreaRef}
        onChange={(e) => {
          changeDayText(e.target.value)
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
        bg-white bg-clip-padding
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
      { savedState === "saved" && "✔️" }
      { savedState === "failed" && "❌" }
    </>
  )
}