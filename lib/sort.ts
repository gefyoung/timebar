import { Event } from './types'

export default function sort(daysMap: Map<string, Record<string, Event>>) {

  const arr = [...daysMap].map(([dayKey, dayValue]) => {
    
    const returnObj: {
      dayKey: string
      dayValue: Event[]
      dayArrayIndex?: number
    } = {
      dayKey: '',
      dayValue: [],
      dayArrayIndex: undefined
    }
    const dayValueArray: Event[] = []
    
    Object.entries(dayValue).forEach(([key, value]) => {
      dayValueArray[value.arrayIndex] = {...value, id: key}
    })


  //  returnObj.dayValue = Array.from(Object.entries(dayValue)).map(([key, value]) => {
  //     // if (Number(flipKey) === 0) {
  //     //   returnObj.dayText = flipValue.text
  //     // }
  //     // value.forEach(event => {})
      
  //     return [
  //       ...value,
  //       id: key
  //     ]
  //   })

    /* if the flip Obj doesnt have duration, ie, dayText, get rid of it */
    // const no0dayArray = dayArray.filter((flipObj) => {
    //   return flipObj.duration
    // })
    returnObj.dayValue = dayValueArray
    returnObj.dayKey = dayKey
    // returnObj.dayValue = no0dayArray
    return returnObj
  })

  return arr.sort((dayA, dayB) => {

    dayA.dayValue = Object.values(dayA.dayValue).sort((eventA, eventB) => {
      if (Number(eventA.arrayIndex) < Number(eventB.arrayIndex)) {
        return -1
      } else if (Number(eventB.arrayIndex) < Number(eventA.arrayIndex)) {
        return 1
      } else {
        return 0
      }
    })

    dayB.dayValue = Object.values(dayB.dayValue).sort((eventA, eventB) => {
      if (Number(eventA.arrayIndex) < Number(eventB.arrayIndex)) {
        return -1
      } else if (Number(eventB.arrayIndex) < Number(eventA.arrayIndex)) {
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