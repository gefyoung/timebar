
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

export default function returnAdvancedWidth(flipArray: FlipEvent[]) {
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

    const color = () => { switch (flipObj.summary) {
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

    flipObj.className = "col-span-" + width + " h-8 " + color

    return flipObj
  })
}