import { Day, Event } from "../../lib/types"
import Image from 'next/image'
import React from "react"


export default function PublicEvents ({ day }: { day: Day }) {




  return (
    <div key={day.dayKey} id="grid96" className="grid grid-cols-96">
      {day.dayValue.map((event: Event, i: number) =>
        <React.Fragment key={event.id}>
        <div
              id={event.id}
              className={event.className}
              
            >
              {
                event.text &&
                <div className="flex mt-3 ml-0.5">
                  <Image width={16} height={16} src="/files.svg" alt="notes icon" />
                </div>
              }
            </div>
        </React.Fragment>
      )}
    </div>

  )
}