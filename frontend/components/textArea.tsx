import { API } from 'aws-amplify'
import axios from 'axios'
import { FlipEvent } from '../pages/id'
import { Autosave, useAutosave } from 'react-autosave'
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


const saveText = async (flip: Flip) => {
  await axios.post('https://npyxqhl803.execute-api.us-east-1.amazonaws.com/saveFlip', flip)
}


export default function TextArea({ flipState }: {flipState: FlipState}) {

  const isDay = flipState.flipEvent.summary === ""

  const [textState, setTextState] = useState(isDay ? flipState.dayText : flipState.flipEvent.text)
  console.log(textState, 'textState', isDay)

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
        onChange={(e) => setTextState(e.target.value)}
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
      <Autosave data={flip} onSave={saveText} />
    </>
  )
}