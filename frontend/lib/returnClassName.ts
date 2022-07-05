
import { Event } from "./types"

function returnWidth(flip: Event) {
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

export function returnOneClassName(event: any) {

  return "col-span-" + (event.duration) + " h-8 " + eventKeyToColor(event.eventNameKey)
}

export default function returnClassName(flipArray: Event[]) {
  let totalDuration = 0
  let width = 0
  flipArray.forEach(flip => totalDuration = totalDuration + returnWidth(flip).width)

  return flipArray.map((flipObj, i) => {
    
    // width = returnWidth(flipObj).width
    width = flipObj.duration
    flipObj.arrayIndex = i

    if (typeof flipObj.eventNameKey === 'number') {
      flipObj.className = "col-span-" + width + " h-8 " + eventKeyToColor(flipObj.eventNameKey)
    }

    return flipObj
  })
}

export function eventKeyToColor (e: number) { switch (e) {
  case 0: return "bg-red-600"
  case 1: return "bg-blue-600"
  case 2: return "bg-orange-500"
  case 3: return "bg-purple-600"
  case 4: return "bg-lime-600"
  case 5: return "bg-pink-600"
  case 6: return "bg-teal-600"
  case 7: return "bg-yellow-400"
  case 8: return "bg-rose-800"
  case 9: return "bg-emerald-800"
  default:
    return "bg-white"
}
}