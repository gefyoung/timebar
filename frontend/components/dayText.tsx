import axios from 'axios'
import { Autosave } from 'react-autosave'
import { useState } from 'react'

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

export default function DayText({ flipState, changeText }: {flipState: FlipState, changeText: (e: string, isDay: boolean) => void}) {

  const [savedState, setSavedState] = useState("")

  const isDay = flipState.flipEvent.summary === ""
  const text = isDay ? flipState.dayText : flipState.flipEvent.text


  const flip = {
    dayKey: flipState.dayKey,
    start: flipState.flipEvent.start,
    dayText: text
  }


  const saveText = async (flip: Flip) => {
    
    try {
      console.log('apiURL', process.env.NEXT_PUBLIC_API_URL)
      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/saveDayText', flip)
      console.log('res', res)
      setSavedState("saved")
    } catch {
      setSavedState("failed")
    }

  }

  // useAutosave({ data: flip, onSave: saveText })

  return (
    <>
      <textarea
        defaultValue={text}
        onChange={(e) => changeText(e.target.value, isDay)}
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
      < button className="px-1 m-1 mr-2 outline-black outline outline-1" onClick={() => saveText(flip)} >save</button>
      { savedState === "saved" && "✔️" }
      { savedState === "failed" && "❌" }
    </>
  )
}