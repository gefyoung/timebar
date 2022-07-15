import { API } from '@aws-amplify/api'
import EventsBar from '../components/days/eventsBar'
import { Day, Event } from '../lib/types'
import PublicEvents from '../components/days/publicEvents'
import '../configureAmplify'
import returnClassName from '../lib/returnClassName'
import { useState } from 'react'
interface MonthData {
  month: string
  days: Day[]
}

export default function UserMonth({ data }: {data: MonthData}) {

  const [selectedDayState, setSelectedDayState] = useState("")
  console.log(data)

  const month = data.month.match(/(.*?)_/)
  const year = data.month.match(/_(.*)/)

  const month1 = month![1]
  const year1 = year![1]

  return (
    <div className="flex justify-center mt-10 ml-4">
      <div className="w-85ch">
        {/* <div className="flex flex-row"> */}

          {data.days.map((day, i) => 
            <div 
              key={i} 
              className="max-w-4xl mb-10" 
              onClick={
                () => day.dayKey === selectedDayState 
                  ? setSelectedDayState("") 
                  : setSelectedDayState(day.dayKey)
              } 
            >{
              (new Date(month1 + "/" + day.dayKey + "/" + year1))
              .toLocaleString('en-us', { weekday: 'long' }) + " " + day.dayKey
            }
              <PublicEvents day={day}/>

              {
                selectedDayState === day.dayKey 
                && day.dayValue.map(event => 
                  <div>
                    <div>{event.eventName}</div>
                    <div className="bg-gray-100">{event.text}</div>
                  </div>
                  )
              }
            </div>
          )}
      </div>
      {/* </div> */}
      </div>
    )
    
}

export async function getStaticPaths() {
  console.log('hello')
  if (!process.env.NEXT_PUBLIC_APIGATEWAY_NAME) { console.log('noEnvs'); return }
  const paths: {params: {id: string}}[] = []
  try {

      paths.push({ params: { id: 'gty_7_2022' } }) 

  } catch (err) {
    console.log('getStaticPathsError')
  }
    return {
      paths,
      fallback: "blocking"
    }

}

export async function getStaticProps({ params }: { params: { id: string } }) {

  const monthYear = '7_2022'

  if (!process.env.NEXT_PUBLIC_APIGATEWAY_NAME) { return }

  try {
    const getUserInit = { body: { monthYear: monthYear } }

    const days: Day[] = await API.post(
      process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getPublicUserMonth", getUserInit
    )
    days.forEach(({ dayValue }: { dayValue: Event[]}) => {
      dayValue = returnClassName(dayValue)
    })

    const data = {
      // user: identityId,
      month: monthYear,
      days: days
    }

    return { props: { data }, revalidate: 1 } 
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }
}
