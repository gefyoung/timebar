import { FlipEvent } from './types'

export default function sort(daysMap: Map<string, Record<string, FlipEvent>>) {

  const arr = [...daysMap].map(([dayKey, dayValue]) => {
    const returnObj: {
      dayKey: string
      dayValue: FlipEvent[]
      dayText?: string
    } = {
      dayKey: '',
      dayValue: [],
    }

    const dayArray = Array.from(Object.entries(dayValue)).map(([flipKey, flipValue]) => {
      if (Number(flipKey) === 0) {
        returnObj.dayText = flipValue.text
      }
      return {
        ...flipValue,
        start: Number(flipKey)
      }
    })
    /* if the flip Obj doesnt have duration, ie, dayText, get rid of it */
    const no0dayArray = dayArray.filter((flipObj) => {
      return flipObj.duration
    })

    returnObj.dayKey = dayKey
    returnObj.dayValue = no0dayArray
    return returnObj
  })

  return arr.sort((dayA, dayB) => {
    dayA.dayValue = Object.values(dayA.dayValue).sort((flipA, flipB) => {
      if (Number(flipA.start) < Number(flipB.start)) {
        return -1
      } else if (Number(flipB.start) < Number(flipA.start)) {
        return 1
      } else {
        return 0
      }
    })

    dayB.dayValue = Object.values(dayB.dayValue).sort((flipA, flipB) => {
      if (Number(flipA.start) < Number(flipB.start)) {
        return -1
      } else if (Number(flipB.start) < Number(flipA.start)) {
        return 1
      } else {
        return 0
      }
    })

    if (Number(dayA.dayKey) < Number(dayB.dayKey)) {
      return 1
    } else if (Number(dayB.dayKey) < Number(dayA.dayKey)) {
      return -1
    } else {
      return 0
    }
  })
}