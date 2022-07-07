import React, { useState, useRef, useEffect } from 'react'
import { Auth } from '@aws-amplify/auth'
import { useRouter } from 'next/router'
import CustomSpinner from '../components/customSpinner'
// import Google from './google'
import '../configureAmplify'

interface CreateAccountProps {
  changePageState: (e: string) => void
}

const createAccount = (props: CreateAccountProps) => {
  const router = useRouter()
  const [loginState, setLoginState] = useState({
    username: '',
    email: '',
    password: '',
    code: '',
  })
  const [inputState, setInputState] = useState({
    err: "",
    hiddenPass: true,
    confirmation: "",
    account: false,
    submitting: false
  })

  const userAddHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await Auth.signUp({
        username: "" + loginState.email,
        password: "" + loginState.password,
        attributes: {
          email: loginState.email
        }
      })
      setInputState({...inputState, err: "accepted", account: true})
    } catch (err) {
      console.log(err)
      // if (err.message === "Username should be an email." || err.code === "UsernameExistsException") {
      //   setErrState("emailBad")
      // }
      // if (err.message.includes('password')) {
      //   setErrState("passBad")
      // }
      // setSubmitAccountState(false)
    }
  }

  const userVerifyHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInputState({...inputState, submitting: false})
    try {
      await Auth.confirmSignUp(loginState.email, loginState.code)
      setInputState({...inputState, confirmation: "accepted", submitting: false})
      await Auth.signIn(loginState.email, loginState.password)
      router.push('/')
    } catch (err) {
      console.log(err)
      setInputState({...inputState, confirmation: "denied", submitting: false})
    }
  }

  return (
    <div className="flex justify-center ml-10 mt-28">
      <div className="w-85ch ">
        <div className="flex flex-col">
          <div className="mb-10 text-3xl">Create an account</div>

          {!inputState.account ? /* change to asterisk to change page flow back to normal */
          <div className="my-5">
        <div className="mb-5">
          Email
          <div>
            <input
              className="px-2 py-1 bg-blue-50"
              onChange={(event) => setLoginState({ ...loginState, email: event.target.value })}
              disabled={(inputState.err === "accepted")}
              placeholder="enter email">
            </input>{(inputState.err === "emailBad") && ' ❌'}
          </div>
        </div>
        <div className="mb-5">
          Password
          <div className="container-fluid row">
            <input
              className="px-2 py-1 bg-blue-50"
              type={inputState.hiddenPass ? "password" : "text"}
              onChange={(event) => setLoginState({ ...loginState, password: event.target.value })}
              disabled={(inputState.err === "accepted")}
              placeholder="enter password"
            ></input>
            <span
              className="ml-2"
              style={{ cursor: "pointer" }}
              onClick={() => setInputState({ ...inputState, hiddenPass: !inputState.hiddenPass})}>
              <span></span>{(inputState.hiddenPass) ? 'show' : 'hide'}
            </span>
            {(inputState.err === "passBad") && ' ❌'}
          </div>
        </div>
        <div className="mt-6 mb-5">
          <button 
            disabled={(inputState.err === "accepted")} 
            onClick={userAddHandler}
            className="px-1 m-1 mr-2 outline-black outline outline-1"
          >Submit</button>
          {(inputState.err === "accepted") && ' ✔️'}
          {inputState.account && <CustomSpinner />}
        </div></div> : <div className="column">

        <div className="mb-2">We sent a confirmation code to your email</div>
        <div className="mb-3">
          <input 
            className="px-2 py-1 bg-blue-50"
            onChange={(event) => setLoginState({ ...loginState, code: '' + event.target.value })} 
            placeholder="Confirmation code"
          ></input>
        </div>
        <div className="flex flex-row">
          <button 
            className="px-1 m-1 mr-2 outline-black outline outline-1"
            disabled={inputState.submitting} 
            onClick={userVerifyHandler}
          >Submit</button>
          {inputState.submitting && <CustomSpinner className="mt-1.5 ml-1"/>}
          {(inputState.confirmation === "accepted") ? <CustomSpinner className="mt-1.5 ml-1"/> : (inputState.confirmation === "denied") ? ' ❌' : null}
        </div>

      </div>}
      
        </div>

      {/* <div className="flex justify-center mt-5">
        <Google {...props} setPageState={setPageState} />
      </div> */}
      <div className="mt-10 ">
        Already have an account? <span 
          className="text-blue-500 cursor-pointer " 
          onClick={() => router.push('/login')}
        >LOG IN</span>
      </div>
    </div>
      
      {/* <div className=""><UserAgreement /></div> */}

    </div>
  )


}

export default createAccount