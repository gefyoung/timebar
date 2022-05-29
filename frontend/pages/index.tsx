import { FC, useEffect, useState } from 'react'
import API from '@aws-amplify/api'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import CreateAccount from '../components/createAccount'
import { Auth } from 'aws-amplify'
import Days from '../components/days'
import CustomSpinner from '../components/customSpinner'
import LogIn from '../components/logIn'
import '../configureAmplify'
import { Day, Event } from '../lib/types'
import returnClassName from '../lib/returnClassName'
import { State } from '../components/days'

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
  page?: string
  auth?: boolean
  loading?: boolean
  data?: UserMonthData
}

const Index = (props: IndexProps) => {
  
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        {/* <button
          className="text-blue-600"
          onClick={() => props.changePageState('create')}
        >Start tracking
        </button> */}
        {props.loading && <CustomSpinner />}
      </h1>
      <div>
      </div>
    </main>
  )
}

const Home: NextPage = () => {

  const [state, setState] = useState<PageState | null>(null)

  const changePageState = (e: string) => {
    setState({...state, page: e})
  }

  

  useEffect(() => {
    (async () => {
      try {
        const user = await Auth.currentCredentials()
        if (user.authenticated) { 
          const params = { body: {
            timezoneOffset: new Date().getTimezoneOffset()
          }}
          const data: UserMonthData = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME??"", '/getUserMonth', params)
          data.days.forEach((dayObj: Day) => {
            dayObj.dayValue = returnClassName(dayObj.dayValue)
          })
          setState({ page: 'days', auth: true, loading: false, data: data })
        } else {
          setState({...state, auth: false, loading: false, page: 'create' })
        }
        
      } catch (err) {
        console.log('err', err)
      }
    })()
  }, [])


  if (state) {
    return (
      <div className={styles.container}>
        <Head>
          <script src="https://apis.google.com/js/platform.js" async defer></script>
          <title>Timebar</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/files.svg" />
        </Head>

        { state.page === 'create' && <CreateAccount changePageState={changePageState}/>}
        { state.page === 'days' && state.data && <Days data={state.data} />}
        { state.page === 'login' && <LogIn changePageState={changePageState}/>}
  
        {/* <footer className={styles.footer}>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer> */}
      </div>
    )
  } else {
    return <div className=""><div className="grid mt-60 place-content-center"><CustomSpinner /></div></div>
  }
  
}

export default Home