
import { FlipEvent } from "./types"

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

export function returnOneClassName(event: any) {

  return "col-span-" + (event.duration + 1) + " h-8 " + eventKeyToColor(event.eventNameKey)
}

export default function returnClassName(flipArray: FlipEvent[]) {
  let totalDuration = 0
  let width = 0
  flipArray.forEach(flip => totalDuration = totalDuration + returnWidth(flip).width)

  return flipArray.map((flipObj) => {
    
    console.log('flipObj', flipObj)
    
    // width = returnWidth(flipObj).width
    width = flipObj.duration

    // if (totalDuration > 96) {
    //   const overAmount = totalDuration - 96

    //   const flipPercentage = (flipObj.duration / 86400000) * 100
    //   if (flipPercentage > 20) {
    //     width = returnWidth(flipObj).width - overAmount
    //   }
    // }

    // if (totalDuration < 96) {
    //   // let underAmount = 96 - totalDuration
    //   width = returnWidth(flipObj).width + 1
    //   totalDuration = totalDuration + 1
    // }

    flipObj.className = "col-span-" + width + " h-8 " + eventKeyToColor(flipObj.eventNameKey)

    return flipObj
  })
}

export function eventKeyToColor (e: number) { switch (e) {
  case 0: return "bg-red-600"
  case 1: return "bg-yellow-600"
  case 2: return "bg-orange-600"
  case 3: return "bg-purple-600"
  case 4: return "bg-amber-600"
  case 5: return "bg-lime-600"
  case 6: return "bg-teal-600"
  case 7: return "bg-blue-600"
  case 8: return "bg-pink-600"
  default:
    return "bg-white"
}
}