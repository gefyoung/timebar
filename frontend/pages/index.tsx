import { FC, useEffect, useState } from 'react'
import API from '@aws-amplify/api'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Auth } from '@aws-amplify/auth'
import Days from '../components/days'
import CustomSpinner from '../components/customSpinner'
import '../configureAmplify'
import { Day, Event } from '../lib/types'
import returnClassName from '../lib/returnClassName'
import { useRouter } from 'next/router'
import { RouterType } from 'aws-cdk-lib/aws-ec2'
import DummyTimebar from '../components/dummyDay'

interface IndexProps {
  changePageState: Function,
  loading: boolean
}

export interface UserMonthData {
  user?: string
  month: string
  days: Day[],
  events: string[]
}

interface PageState {
  auth: boolean
  loading: boolean
  data: UserMonthData | null
}

const Home: NextPage = () => {

  const router = useRouter()
  const [state, setState] = useState<PageState | null>(null)

  // const changePageState = (e: string) => {
  //   setState({...state})
  // }

  const date = new Date()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const monthYear = month + "_" + year

  const getPreviousMonth = async () => {

    const params = {
      body: {
        timezoneOffset: date.getTimezoneOffset(),
        monthYear: date.getMonth() + "_" + year
      }
    }
    try {
      const data: UserMonthData = await API.post(
        process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/getUserMonth', params
      )
      data.days.forEach((dayObj: Day) => {
        dayObj.dayValue = returnClassName(dayObj.dayValue)
      })
      setState({ auth: true, loading: false, data: data })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await Auth.currentCredentials()
        const params = {
          body: {
            timezoneOffset: date.getTimezoneOffset(),
            monthYear: monthYear
          }
        }

        const data: UserMonthData = await API.post(
          process.env.NEXT_PUBLIC_APIGATEWAY_NAME ?? "", '/getUserMonth', params
        )
        data.days.forEach((dayObj: Day) => {
          dayObj.dayValue = returnClassName(dayObj.dayValue)
        })
        setState({ auth: true, loading: false, data: data })

      } catch (err) {
        setState({ auth: false, loading: false, data: null })
        console.log('err', err)
      }
    })()
  }, [])


  if (state?.data) {
    return (
      <Days
        data={state.data}
        getPreviousMonth={getPreviousMonth}
      />
    )
  } else {
    return (
      <div className="">
        <div className="flex flex-col mt-40">
          <div className="flex mb-10 ml-1 text-3xl place-content-center">Timebar</div>
          { state && !state.loading && !state.data
          ? <DummyTimebar pageState={state}/>
          : <div className="grid mt-4 place-content-center"><CustomSpinner /></div>
          }
          <div
            className="grid mt-20 text-blue-600 cursor-pointer place-content-center"
            onClick={() => router.push('/createAccount')}
          >Create an account
          </div>
          {/* <div
            className="grid mt-12 text-blue-600 cursor-pointer place-content-center"
            onClick={() => router.push('/gty')}
          >Look at my notes
          </div> */}
        </div>
      </div>
    )
  }

}

export default Home