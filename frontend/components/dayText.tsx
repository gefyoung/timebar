import axios from 'axios'
import { Autosave } from 'react-autosave'
import { useRef, useState } from 'react'

interface FlipState {
  flipEvent: {
    summary: string,
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

  const isDay = flipState.flipEvent.summary === ""

  const saveText = async () => {
    /* This is purposely object oriented because I cannot depend on the flipState for text as it causes a rerender
    and thus the textArea is deselected; I use useRef but if I define flip outside of saveText, dayText is stale */
    const flip = {
      dayKey: flipState.dayKey,
      start: flipState.flipEvent.start,
      dayText: textAreaRef.current?.value,
      monthYear: monthState.monthYear
    }
    console.log('savetext', textAreaRef.current?.value)
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/saveDayText', flip)
      console.log('res', res)
      setSavedState("saved")
    } catch {
      setSavedState("failed")
    }

  }

  return (
    <>
      <textarea
        defaultValue={flipState.dayText}
        ref={textAreaRef}
        onChange={(e) => changeDayText(e.target.value)}
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
      < button className="px-1 m-1 mr-2 outline-black outline outline-1" onClick={() => saveText()} >save</button>
      { savedState === "saved" && "✔️" }
      { savedState === "failed" && "❌" }
    </>
  )
}