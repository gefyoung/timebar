import React, { useRef, useState,  } from "react";
import { Auth } from '@aws-amplify/auth'
import CustomSpinner from "./customSpinner"
import '../configureAmplify'
import { useRouter } from 'next/router'
// import Google from "./google";

interface CreateAccountProps {
  changePageState: (e: string) => void
}


const LogIn = (props: CreateAccountProps) => {

  const [hiddenPassState, setHiddenPassState] = useState(true)

  const router = useRouter()

  const [isSubmitting, setSubmitting] = useState(false)
  const [errState, setErrState] = useState("")
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passInputRef = useRef<HTMLInputElement>(null)

  const userLoginHandler = async (e: any) => {
    setSubmitting(true)
    e.preventDefault();
    try {
      if (emailInputRef.current && passInputRef.current) {
        await Auth.signIn(
          emailInputRef.current.value,
          passInputRef.current.value
        )
        setSubmitting(false)
      }
      props.changePageState("")
      // setPageState(false)
    } catch (err: any) {
      if (err.code === "UserNotFoundException") {
        setErrState("emailErr")
      }
      if (err.code === "NotAuthorizedException") {
        setErrState("passErr")
      }
      setSubmitting(false)
    }
  };

  return (
    <>
      <div className="flex flex-col mx-5">
        <div className="mb-10 text-3xl">Log In</div>


        {/* <div className="flex justify-center mt-5"><Google {...props} setPageState={setPageState} /></div> */}
        <div className="flex justify-center mt-5">Or</div>
        <div className="my-5">
          Email
          <div>
            <input className="px-2 py-1 bg-blue-50" type="email" ref={emailInputRef} placeholder="enter email"></input>
            {errState === "emailErr" && ' ❌'}
          </div>
        </div>

        <div className="mb-5">
          Password
          <div>
            <input className="px-2 py-1 bg-blue-50" type={hiddenPassState ? "password" : "text"} ref={passInputRef} placeholder="enter password"></input>
            <span
              className="ml-2"
              style={{ cursor: "pointer" }}
              onClick={() => setHiddenPassState(!hiddenPassState)}>
              <span></span>{(hiddenPassState) ? 'show' : 'hide'}
            </span>
            {errState === "passErr" && ' ❌'}
          </div>
        </div>

        <div className="flex flex-row mb-10">
          <button onClick={userLoginHandler} disabled={isSubmitting}>Log In </button>
          <div className="mx-2 mt-1">{isSubmitting && <CustomSpinner />}</div>
        </div>

        <div className="mb-5">
          {/* <div className="link-button">Forgot your <span onClick={() => setPageState('resetPass')} className="text-blue-500 cursor-pointer">password</span>?</div> */}
        </div>
        {/* <UserAgreement /> */}

        <div className="mt-10">
          {/* Don&apos;t have an account? <span className="text-blue-500 cursor-pointer" onClick={() => setPageState('signUp')}>SIGN UP</span> */}
        </div>
      </div>


    </>
  )
}

export default LogIn;
