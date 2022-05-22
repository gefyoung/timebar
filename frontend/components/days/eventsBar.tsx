
import { Day, FlipEvent } from "../../lib/types"
import Image from "next/dist/client/image"
import { DragEvent } from "react"


const EventsBar = ({ 
  day, 
  selectedEvent, 
  selectEvent, 
  drag, 
  eventDeleted, 
  dragStart, 
  dragEnd,
  touchMove
 }:
  {
    day: Day,
    selectedEvent: any,
    selectEvent: (flipEvent: any, dayKey: any, i: any) => void
    drag: (e: DragEvent) => void
    eventDeleted: (e: any) => void
    dragStart: (e: DragEvent, duration: number) => void
    dragEnd: (e: number) => void
    touchMove: (e: any) => void
  }) => {

  return (
    <div id="grid96" className="grid grid-cols-96">
      {day.dayValue.map((flipEvent: FlipEvent, i: number) =>
        <>
          {selectedEvent.flipEvent.start === flipEvent.start
            && selectedEvent.dayKey === parseInt(day.dayKey)

            ?
            <><div
              key={flipEvent.start}
              className={flipEvent.className + " relative border-black border-2 flex flex-row"}
              onClick={() => selectEvent(flipEvent, Number(day.dayKey), i)}
              id="selectedEventBox"
            // draggable={true}
            >
                {
                  flipEvent.text &&
                  <div id="chevron" className="mt-2 ">
                    <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                  </div>
                }
                
                <div 
                  onDrag={(e) => drag(e)} 
                  onDragStart={(e) => dragStart(e, flipEvent.duration)}
                  onDragEnd={() => dragEnd(flipEvent.duration)}
                  // onTouchStart={(e) => touchMove(e)}
                  onTouchMove={(e) => touchMove(e)} 
                  // onTouchEnd={() => dragEnd(flipEvent.duration)}

                  className="absolute mt-1 -right-3 cursor-ew-resize"
                >
                  <Image width={16} height={16} src="/rightArrow.svg" alt="resize" />
                </div>

            </div>

            </>


            : <div
              key={flipEvent.start}
              className={flipEvent.className}
              onClick={() => selectEvent(flipEvent, Number(day.dayKey), i)}
            >
              {
                flipEvent.text &&
                <div className="flex mt-3 ml-0.5"><Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>
              }
            </div>

          }
        </>
      )}
      {selectedEvent.flipEvent.start !== 0 && selectedEvent.dayKey === parseInt(day.dayKey)
        && <button
          className="ml-2"
          onClick={eventDeleted}
        >delete</button>}
    </div>

  )
}


export default EventsBar