
import { Day, Event } from "../../lib/types"
import Image from "next/dist/client/image"
import { DragEvent } from "react"
import { API } from '@aws-amplify/api'
import { State } from '../../lib/daysReducer'

const EventsBar = ({ 
  state,
  day, 
  selectedEvent, 
  dispatch,
  touchMove
 }:
  {
    day: Day,
    selectedEvent: Event,
    dispatch: ({type, event, dayKey, arrayIndex, dragEvent}: 
      {type: string, event?: Event, dayKey?: string, arrayIndex?: number, dragEvent?: DragEvent }) => void
    touchMove: (e: any) => void
    state: State
  }) => {


  
  const dragEnd = async (duration: number) => {

    const params = {
      body: {
        dayKey: state.selectedEvent.dayKey,
        monthYear: state.monthYear,
        start: state.selectedEvent.start,
        duration: duration,
      }
    }
    await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/saveDuration', params)

  }


  return (
    <div id="grid96" className="grid grid-cols-96">
      {day.dayValue.map((mapDataEvent: Event, i: number) =>
        <>
          {selectedEvent.start === mapDataEvent.start
            && selectedEvent.dayKey === day.dayKey
            ?
            <><div
              key={mapDataEvent.start}
              className={mapDataEvent.className + " relative border-black border-2 flex flex-row"}
              id="selectedEventBox"
            >
                {
                  mapDataEvent.text &&
                  <div id="chevron" className="mt-2 ">
                    <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                  </div>
                }
                
                <div 
                  onDrag={(e) => dispatch({ type: "drag", dragEvent: e })} 
                  onDragEnd={() => dragEnd(mapDataEvent.duration)}
                  // onTouchStart={(e) => touchMove(e)}
                  onTouchMove={(e) => dispatch({ type: "touchMove", touchEvent: e })} 
                  // onTouchEnd={() => dragEnd(flipEvent.duration)}

                  className="absolute mt-1 -right-3 cursor-ew-resize"
                >
                  <Image width={16} height={16} src="/rightArrow.svg" alt="resize" />
                </div>

            </div>

            </>


            : <div
              key={mapDataEvent.start}
              className={mapDataEvent.className}
              onClick={() => dispatch({
                type: "selectEvent",
                event: mapDataEvent, 
                dayKey: day.dayKey, 
                arrayIndex: i
              })}
            >
              {
                mapDataEvent.text &&
                <div className="flex mt-3 ml-0.5"><Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>
              }
            </div>

          }
        </>
      )}
      {selectedEvent.start !== 0 && selectedEvent.dayKey === day.dayKey
        && <button
          className="ml-2"
          onClick={() => dispatch({ type: "eventDeleted" }) }
        >delete</button>}
    </div>

  )
}


export default EventsBar