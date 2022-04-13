
import { useState } from 'react'
import TextArea from '../components/textArea'
import Image from 'next/image'

export interface FlipEvent {
  dayBegins?: number
  start: number
  duration: number
  summary: string
  className: string
  text?: string
}
interface Day {
  dayKey: string
  dayValue: FlipEvent[]
  dayText?: string
}

export default function Id({ data }: { data: Day[] }) {

  const [selectedEventState, setSelectedEventState] = useState({
    flipEvent: {
      summary: "",
      text: "",
      start: 0
    },
    dayKey: 0,
    dayText: ""
  })

  const [dataState, setDataState] = useState(data)


  if (!data) {
    return (
      <div className="p-5 m-20 outline">Data error</div>
    )
  }

  const changeText = (e: string, isDay: boolean) => {
    const editedArray = dataState
    dataState.forEach((dataDay, i) => {
      if (selectedEventState.dayKey === Number(dataDay.dayKey)) {
        if (!isDay) {
          const flipArray: FlipEvent[] = dataDay.dayValue

          dataDay.dayValue.forEach((flip, x) => {
            if (selectedEventState.flipEvent.start === flip.start) {
              const newFlip = {
                ...flip,
                text: e
              }
              flipArray.splice(x, 1, newFlip)
            }
          })

          const newDay = {
            ...dataDay,
            dayValue: flipArray
          }
          editedArray.splice(i, 1, newDay)

        
        } else {
          const newDay = {
            ...dataDay,
            dayText: e
          }
          editedArray.splice(i, 1, newDay)
          
        }
      }
    })
    setDataState(editedArray)
  }

  const selectFlip = (flipEvent: FlipEvent, dayKey: number) => {
    console.log('selectflipstate-', selectedEventState)
    setSelectedEventState({
      flipEvent: {
        summary: flipEvent.summary,
        text: flipEvent.text ?? "",
        start: flipEvent.start
      },
      dayKey: Number(dayKey),
      dayText: selectedEventState.dayText
    })
  }

  const selectDay = (day: Day) => {
    console.log('dayclickstate-', selectedEventState)
    setSelectedEventState({
      flipEvent: {
        summary: "",
        text: selectedEventState.flipEvent.text ?? "",
        start: 0
      },
      dayKey: Number(day.dayKey),
      dayText: day.dayText ?? ""
    })
  }

  const FlipComponent = ({ flipEvent, dayKey }: { flipEvent: FlipEvent, dayKey: string }) => (
    <>
      <div
        key={flipEvent.start}
        className={flipEvent.className}
        onClick={() => selectFlip(flipEvent, Number(dayKey))}>
        {flipEvent.text && 
        <div className="h-4 mt-4"><Image width={16} height={16}  src="/files.svg" alt="notes icon" />
        </div>}
      </div>

    </>
  )

  const TimeBar = ({ day }: { day: Day }) => {

    return (
      <div className="max-w-4xl mb-10" key={day.dayKey}>

        <div className="flex flex-row" onClick={() => selectDay(day)} >
          {new Date(parseInt(day.dayKey)).toLocaleDateString() + ' ' +
            new Date(parseInt(day.dayKey)).toLocaleString('en-us', { weekday: 'long' })}
          {day.dayText && <div className="h-4 mt-2 ml-1">
            <Image width={16} height={16} src="/files.svg" alt="notes icon" />
            </div>}
        </div>

        <div className="grid grid-cols-96">
          {day.dayValue.map((flipEvent: FlipEvent) =>
            <FlipComponent key={flipEvent.start} dayKey={day.dayKey} flipEvent={flipEvent} />
          )}
        </div>

        <div>
          {selectedEventState.dayKey === parseInt(day.dayKey)
            && <FlipEditor />
          }
        </div>
      </div>
    )
  }

  const FlipEditor = () => {
    return (
      <div className='bg-gray-100'>
        {selectedEventState.flipEvent.summary !== ""
          ? <div>
            <div>{selectedEventState.flipEvent.summary}</div>
            <div>
              {/* <textarea defaultValue={selectedEventState.flipEvent.text} ref={flipTextRef}></textarea> */}
              <TextArea changeText={changeText} flipState={selectedEventState} />
            </div>
            {/* <button onClick={() => submitFlipText()} className="outline">submit</button> */}
          </div> : <div className="mt-6">
            {/* <textarea defaultValue={selectedEventState.dayText} ref={dayTextRef}></textarea> */}
            <TextArea changeText={changeText} flipState={selectedEventState} />
            {/* <button onClick={() => submitDayText()} className="outline">submit</button> */}
          </div>
        }
      </div>
    )
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="w-85ch">
        {
          dataState.map((day) =>
            <TimeBar key={day.dayKey} day={day} />
          )
        }
      </div>
    </div>
  )
}

function returnWidth(flip: FlipEvent) {
  if (!flip.duration) { return { width: 0, down: 0, up: 0 } }
  // let width = 0
  const flipDuration = Number(flip.duration)
  const minutes = flipDuration / 60000
  const part48 = (minutes / 15)

  const rounded = Math.round(part48) ? Math.round(part48) : 1
  let down = 0
  const up = 0
  if (part48 > rounded) {
    down = part48 - rounded
  }
  if (part48 < rounded) {
    down = rounded - part48
  }
  const numObj = {
    width: rounded,
    down: down,
    up: up
  }
  return numObj
}

function returnAdvancedWidth(flipArray: FlipEvent[]) {
  let totalDuration = 0
  let width = 0
  flipArray.forEach(flip => totalDuration = totalDuration + returnWidth(flip).width)

  return flipArray.map((flipObj) => {
    width = returnWidth(flipObj).width

    if (totalDuration > 96) {
      const overAmount = totalDuration - 96

      const flipPercentage = (flipObj.duration / 86400000) * 100
      if (flipPercentage > 20) {
        width = returnWidth(flipObj).width - overAmount
      }
    }

    if (totalDuration < 96) {
      // let underAmount = 96 - totalDuration
      width = returnWidth(flipObj).width + 1
      totalDuration = totalDuration + 1
    }

    const color = returnColor(flipObj.summary)

    flipObj.className = "col-span-" + width + " h-8 " + color

    return flipObj
  })
}

function returnColor(summary: string) {
  switch (summary) {
    case "Jerkin": return "bg-red-600"
    case "Learning": return "bg-yellow-600"
    case "Type 1 leisure": return "bg-orange-600"
    case "Sleeping": return "bg-purple-600"
    case "Weed": return "bg-amber-600"
    case "Socializing": return "bg-lime-600"
    case "Beer": return "bg-teal-600"
    case "Working out": return "bg-blue-600"
    case "Type 2 leisure": return "bg-pink-600"
    case "Shop/Chores": return "bg-rose-600"
    case "Skiing": return "bg-cyan-600"
    case "Norski": return "bg-black"
    default:
      "bg-white"
  }
}

export async function getStaticProps() {
  try {
    const apiUrl = process.env.API_URL ?? "https://os45ecguvi.execute-api.us-east-1.amazonaws.com"
    const res = await fetch(apiUrl, { method: "GET" })
    const response = await res.text()
    const data: Day[] = JSON.parse(response)
    data.forEach((dayObj: Day) => {
      dayObj.dayValue = returnAdvancedWidth(dayObj.dayValue)
    })



    return { props: { data: data }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}