import ical from 'node-ical'

export default function Id({ data }: any) {

  function groupBy(objectArray: any, property: any) {
    return objectArray.reduce(function (acc: any, obj: any) {
      let key = obj[property]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, [])
  }

  const groupedDays = groupBy(data, 'dayBegins')
  const keylessArray: any[] = []
  Object.values(groupedDays).forEach((day: any) => {
    keylessArray.push(day)
  })

  let day = 84000

  interface FlipEvent {
    dayBegins: number
    dayEnds: number
    start: number
    duration: number
    startDate: Date
    summary: string
  }

  const FlipComponent = ({ flipEvent }: any) => {
    console.log(flipEvent.summary, flipEvent.duration)
    const eventSpan: any[] = []

    // for (let duration = flipEvent.duration; duration > 0; duration - 1) {
    //   flipEvent.className = `w-${duration} ` + flipEvent.className
    // }
    
    return <div>
      {
            eventSpan.map((sliver) => {
              return <span 
              className={sliver.className}
            ></span>
            })
      }
    </div>


  }

  const DayComponent = ({ day }: any) => {
    console.log(day)
    return <div className="flex my-10 w-96 bg-green-50">{
      day.map((flipEvent: FlipEvent) =>
        <FlipComponent key={flipEvent.start}  flipEvent={flipEvent} />
      )}</div>
  }

  // return (
  //   <div className="mx-10">
  //     {keylessArray.map((day) => 
  //       <div key={keylessArray.indexOf(day)}>
  //       <DayComponent key={day} day={day} />
  //       </div>
  //     )}
  //   </div>
  // )
  return (
        <div key={keylessArray.indexOf(day)}>
        <DayComponent key={day} day={keylessArray[2]} />
        </div>
  )
}

const returnColor = (summary: any) => {
  switch (summary) {
    case "Jerkin": return "bg-red-600"
    case "Learning": return "bg-yellow-600"
    case "Eating": return "bg-orange-600"
    case "Sleeping": return "bg-purple-600"
    case "Weed": return "bg-amber-600"
    case "Socializing": return "bg-lime-600"
    case "Beer": return "bg-teal-600"
    case "Working out": return "bg-violet-600"
    case "Insta/tv/youtub": return "bg-pink-600"
    case "Shop/Chores": return "bg-rose-600"
    case "Skiing": return "bg-cyan-600"
    case "Norski": return "bg-indigo-600"
    default:
      "bg-white"
  }
}

const returnWidth = (duration: any) => {

  return `py-${duration}`
}
const getMinutes = (duration: any) => {
  return Math.ceil(duration / 60000)
}
function durate(sorted: any){
  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].duration = sorted[i + 1].start - sorted[i].start
  }
  return sorted
}


export async function getStaticProps() {
  try {
    const parsedICAL = await ical.async.fromURL('https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff')

    const eventArray: any[] = []

    for (const calEvent of Object.values(parsedICAL)) {

      const userTZ = 'America/Denver'

      

      if (calEvent.start instanceof Date) {
        const utcDate = new Date(calEvent.start)
        const convertedTZ = utcDate.toLocaleString("en-US", { timeZone: userTZ })
        const convertedDate = new Date(convertedTZ)
        const startTime = convertedDate.getTime()

        const dayBegins = Date.parse(convertedDate.toDateString())

        let newShit = {
          dayBegins: dayBegins,
          dayEnds: dayBegins + 8640000,
          start: startTime,
          duration: null,
          startDate: convertedTZ,
          summary: calEvent.summary,
          className: null
        }
        eventArray.push(newShit)
      }
    }

    const sorted = eventArray.sort((a, b) => {
      if (a.start < b.start) {
        return -1
      } else if (b.start < a.start) {
        return 1
      } else {
        return 0
      }
    })

    return { props: { data: durate(sorted) }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}