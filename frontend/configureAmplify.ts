import { Amplify } from 'aws-amplify'

let error = "none"

try {
  const auth = {
    region: process.env.NEXT_PUBLIC_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID,
    identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY
  }

  Amplify.configure({
    Auth: auth,
    API: {
      endpoints: [{ 
        name: process.env.NEXT_PUBLIC_APIGATEWAY_NAME, 
        endpoint: process.env.NEXT_PUBLIC_API_URL,
      }]
    },
    // ssr: true
  })
} catch (err) {
  error = JSON.stringify(err)
  console.log('amplifyConfigErr', err)
}

export function amplifyError () { 
  return error
}