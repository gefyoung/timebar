import { API } from '@aws-amplify/api'
import { useRef, useState } from 'react'

interface SelectedEvent {
  dayKey: string
  start: number
  text?: string
  dayText?: string
  eventName?: string
}

export default function TextArea({ selectedEvent, dispatch, monthYear }: {
  selectedEvent: SelectedEvent
  dispatch: (e: any ) => void
  monthYear: string
}) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [savedState, setSavedState] = useState("")

  const saveText = async () => {
    const flip = { body: {
      dayKey: selectedEvent.dayKey,
      start: selectedEvent.start,
      text: textAreaRef.current?.value,
      monthYear: monthYear,
      eventName: selectedEvent.eventName
    }}

    try {
      const res = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/saveText', flip)
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
        h-28
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