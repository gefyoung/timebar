import axios from 'axios'
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

export default function TextArea({ flipState, changeText, monthState, eventName }: {
  flipState: FlipState
  changeText: (e: string) => void
  monthState: { month: string, year: number, monthYear: string }
  eventName: string
}) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [savedState, setSavedState] = useState("")

  const saveText = async () => {
    const flip = {
      dayKey: flipState.dayKey,
      start: flipState.flipEvent.start,
      text: textAreaRef.current?.value,
      monthYear: monthState.monthYear,
      eventName: eventName
    }
    console.log('savetext', textAreaRef.current?.value)
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/saveText', flip)
      console.log('res', res)
      setSavedState("saved")
    } catch {
      setSavedState("failed")
    }

  }

  return (
    <>
      <textarea
        defaultValue={flipState.flipEvent.text}
        ref={textAreaRef}
        // onChange={(e) => changeText(e.target.value)}
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
      <button 
        className="px-1 m-1 mr-2 outline-black outline outline-1" 
        onClick={() => saveText()}
      >save</button>
      { savedState === "saved" && "✔️" }
      { savedState === "failed" && "❌" }
    </>
  )
}