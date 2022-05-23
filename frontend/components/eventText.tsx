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

interface SelectedEvent {
  dayKey: string
  start: number
  text?: string
  dayText?: string
}


export default function TextArea({ selectedEvent, dispatch, monthState, eventName }: {
  selectedEvent: SelectedEvent
  dispatch: (e: any ) => void
  monthState: { month: string, year: number, monthYear: string }
  eventName: string
}) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [savedState, setSavedState] = useState("")

  const saveText = async () => {
    const flip = {
      dayKey: selectedEvent.dayKey,
      start: selectedEvent.start,
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
        defaultValue={selectedEvent.text}
        ref={textAreaRef}
        onChange={(e) => {
          dispatch({ type: "changeEventText", 
                text: e.target.value
        })
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
      <button 
        className="px-1 m-1 mr-2 outline-black outline outline-1" 
        onClick={() => saveText()}
      >save</button>
      { savedState === "saved" && "✔️" }
      { savedState === "failed" && "❌" }
    </>
  )
}