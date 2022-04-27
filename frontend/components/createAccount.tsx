import React, { useState, useRef, useEffect } from 'react'
import { Auth } from '@aws-amplify/auth'
import { useRouter } from 'next/router'
import CustomSpinner from './customSpinner'
import '../configureAmplify'
// import Google from './google'

interface CreateAccountProps {
  changeState: () => void
}

const CreateAccount = (props: CreateAccountProps) => {

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

  const userAddHandler = async (e: any) => {
    e.preventDefault();

    try {
      const shit = await Auth.signUp({
        username: "" + loginState.email,
        password: "" + loginState.password,
        attributes: {
          email: loginState.email
        }
      })
      setInputState({...inputState, err: "accepted", account: true})
      console.log('shit', shit)
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

  const userVerifyHandler = async (e: any) => {
    e.preventDefault();
    setInputState({...inputState, submitting: false})
    try {
      await Auth.confirmSignUp(loginState.email, loginState.code)
      setInputState({...inputState, confirmation: "accepted", submitting: false})
      const authSignInRes = await Auth.signIn(loginState.email, loginState.password)
    } catch (err) {
      console.log(err)
      setInputState({...inputState, confirmation: "denied", submitting: false})
    }
  }

  return (
    <div className="flex flex-col ">
      <div className="mb-10 text-3xl ">Create an account</div>
      {/* <div className="flex justify-center mt-5">
        <Google {...props} setPageState={setPageState} />
      </div> */}
    <div className="flex justify-center mt-5">Or</div>
      {!inputState.account ? <div className="my-5">
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
        <div className="mb-5">
          <button disabled={(inputState.err === "accepted")} onClick={userAddHandler}>Submit</button>
          {(inputState.err === "accepted") && ' ✔️'}
          {inputState.account && <CustomSpinner />}
        </div></div> : <div className="m-5 column">

        <div className="mb-2">We sent a confirmation code to your email</div>
        <div className="mb-3">
          <input onChange={(event) => setLoginState({ ...loginState, code: '' + event.target.value })} placeholder="Confirmation code"></input>
        </div>
        <div>
          <button disabled={inputState.submitting} onClick={userVerifyHandler}>submit</button>
          {inputState.submitting && <CustomSpinner />}
          {(inputState.confirmation === "accepted") ? <CustomSpinner /> : (inputState.confirmation === "denied") ? ' ❌' : null}
        </div>

      </div>}
      {/* <div className=""><UserAgreement /></div> */}
      <div className="mt-10 ">
        Already have an account? <span 
          className="text-blue-500 cursor-pointer " 
          onClick={() => props.changeState()}
        >LOG IN</span>
      </div>
    </div>
  )


}

export default CreateAccount