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

export default function TextArea({ flipState, changeText }: {flipState: FlipState, changeText: (e: string, isDay: boolean) => void}) {

  const [savedState, setSavedState] = useState(false)


  const saveText = async (flip: Flip) => {
    const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/saveFlip', flip)
    console.log('res', res)
    setSavedState(true)
  }
  const isDay = flipState.flipEvent.summary === ""
  const text = isDay ? flipState.dayText : flipState.flipEvent.text


  const flip = {
    dayKey: flipState.dayKey,
    start: flipState.flipEvent.start,
    dayText: text
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
      < button onClick={() => saveText(flip)} ></button>
      { savedState ? "✔️" : "❌" }
    </>
  )
}