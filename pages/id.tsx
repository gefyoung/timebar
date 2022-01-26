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
    let duration = Math.ceil(flipEvent.duration / 1000000)
    // let newDuration = duration * 10000
    // console.log(duration)

    // let customClass = `w-${10} ` + returnColor(flipEvent.summary)
    // console.log(customClass)

    return <div 
      key={flipEvent.summary + flipEvent.duration} 
      className={flipEvent.className}
      //   flipEvent.summary === "Jerkin" ? flipEvent.className
      //   : flipEvent.summary === "Learning" ? " p-1 bg-yellow-600"
      //   : flipEvent.summary === "Eating" ? "p-1 bg-purple-600"
      //   : flipEvent.summary === "Sleeping" ? "p-1 bg-orange-600"
      //   : flipEvent.summary === "Weed" ? "p-1 bg-amber-600"
      //   : flipEvent.summary === "Socializing" ? "w-0.5 bg-lime-600"
      //   : flipEvent.summary === "Beer" ? "p-1 bg-teal-600"
      //   : flipEvent.summary === "Working out" ? "p-1 bg-violet-600"
      //   : flipEvent.summary === "Insta/tv/youtub" ? "p-1 bg-pink-600"
      //   : flipEvent.summary === "Shop/Chores" ? "p-1 bg-rose-600"
      //   : flipEvent.summary === "Weed" ? "p-1 bg-indigo-600"
      //   : flipEvent.summary === "Skiing" ? "p-1 bg-cyan-600"
      //   : "p-1 bg-white"
      // }
    ></div>
  }

  const DayComponent = ({ day }: any) => {
    return <div className="flex my-10 w-96 bg-green-50">{
      day.map((flipEvent: FlipEvent) =>
      <div>
        <FlipComponent flipEvent={flipEvent} />
        </div>
      )}</div>
  }

  return (
    <div className="mx-10">
      {keylessArray.map((day) => 
        <DayComponent key={day} day={day} />
      )}
    </div>
  )
}


const returnColor = (summary: any) => {
  console.log(summary)
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

export async function getStaticProps() {
  try {
    const parsedICAL = await ical.async.fromURL('https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff')

    const eventArray: any[] = []

    for (const calEvent of Object.values(parsedICAL)) {

      const userTZ = 'America/Denver'

      const className = "p-1 " + returnColor(calEvent.summary)

      if (calEvent.start instanceof Date) {
        const utcDate = new Date(calEvent.start)
        const convertedTZ = utcDate.toLocaleString("en-US", { timeZone: userTZ })
        const convertedDate = new Date(convertedTZ)
        const startTime = convertedDate.getTime()

        const dayBegins = Date.parse(convertedDate.toDateString())

        const newShit = {
          dayBegins: dayBegins,
          dayEnds: dayBegins + 8640000,
          start: startTime,
          duration: null,
          startDate: convertedTZ,
          summary: calEvent.summary,
          className: className
        }
        eventArray.push(newShit)
      }
    }

    const sorted = eventArray.sort((a, b) => {
      if (a.start > b.start) {
        b.duration = a.start - b.start
        return 1
      } else if (b.start > a.start) {
        a.duration = b.start - a.start
        return -1
      } else {
        return 0
      }
    })

    return { props: { data: eventArray }, revalidate: 1 }
  } catch (err) {
    return { props: { data: null }, revalidate: 1 }
  }

}