import { API } from '@aws-amplify/api'
import { Day, Event } from '../lib/types'
import PublicEvents from '../components/days/publicEvents'
import { amplifyError } from '../configureAmplify'
import '../configureAmplify'
import returnClassName from '../lib/returnClassName'
import { useState } from 'react'
import { Amplify } from '@aws-amplify/core'

interface MonthData {
  month: string
  days: Day[]
  error: any
}

export default function UserMonth({ data }: {data: MonthData}) {

  const [selectedDayState, setSelectedDayState] = useState("")
  console.log(JSON.stringify(data))
  if (data.error) {
    console.log("data.error", data.error)
    return <div>no data</div>
  }

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

            >
              <div               onClick={
                () => day.dayKey === selectedDayState 
                  ? setSelectedDayState("") 
                  : setSelectedDayState(day.dayKey)
              } >{(new Date(month1 + "/" + day.dayKey + "/" + year1))
              .toLocaleString('en-us', { weekday: 'long' }) + " " + day.dayKey}
            
              <PublicEvents day={day}/></div>

              {
                selectedDayState === day.dayKey 
                && day.dayValue.map(event => 
                  <div key={event.id}>
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
  console.log("process.env.NEXT_PUBLIC_APIGATEWAY_NAME", process.env.NEXT_PUBLIC_APIGATEWAY_NAME)
  const paths: {params: {id: string}}[] = []
  try {
    const getUserInit = { body: { userAlias: 'gty', monthYear: '7_2022' } }

    await API.post(
      process.env.NEXT_PUBLIC_APIGATEWAY_NAME?? "", "/getPublicUserMonth", getUserInit
    )
    paths.push({ params: { id: 'gty_7_2022' } })

  } catch (err) {
    console.log(err)
  }
  console.log('paths', paths)
    return {
      paths,
      fallback: "blocking"
    }

}

export async function getStaticProps({ params }: { params: { id: string } }) {
  console.log('ENV', process.env.NODE_ENV)
  const monthYear = '7_2022'
  // console.log('@@@@@NEXT_PUBLIC_APIGATEWAY_NAME', process.env.NEXT_PUBLIC_APIGATEWAY_NAME)
  let data: {
    error: any
    month?: string
    days?: Day[]
  }
  // if (process.env.NEXT_PUBLIC_APIGATEWAY_NAME) { console.log('env error'); return }
  
  try {

    const getUserInit = { body: { userAlias: 'gty', monthYear: monthYear } }

    const days: Day[] = await API.post(
      process.env.NEXT_PUBLIC_APIGATEWAY_NAME?? "", "/getPublicUserMonth", getUserInit
    )
    console.log('DAYSSS length', days)
    days.forEach(({ dayValue }: { dayValue: Event[]}) => {
      dayValue = returnClassName(dayValue)
    })
    
    data = 
    {
      error: null,
      // user: identityId,
      month: monthYear,
      days: days,
    }
    return { props: { data }, revalidate: 1 } 

  } catch (err) {
    console.log(err)
    // data = { error: amplifyError()}
    return { notFound: true }
  }
  
}
