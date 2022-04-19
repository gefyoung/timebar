import axios from 'axios'
// import { Autosave } from 'react-autosave'
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


// const saveText = async (flip: Flip) => {
//   await axios.post(process.env.API_URL + '/saveFlip', flip)
// }


export default function TextArea({ flipState, changeText }: {flipState: FlipState, changeText: (e: string, isDay: boolean) => void}) {

  const isDay = flipState.flipEvent.summary === ""

  const [textState] = useState(isDay ? flipState.dayText : flipState.flipEvent.text)

  const flip = isDay ? {
    dayKey: flipState.dayKey,
    start: flipState.flipEvent.start,
    dayText: textState
  } : {
    dayKey: flipState.dayKey,
    start: flipState.flipEvent.start,
    text: textState
  }

  // useAutosave({ data: flip, onSave: saveText })

  return (
    <>
      <textarea
        defaultValue={isDay ? flipState.dayText : flipState.flipEvent.text}
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
      {/* <Autosave data={flip} onSave={() => saveText(flip)} /> */}
    </>
  )
}