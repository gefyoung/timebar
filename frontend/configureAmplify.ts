import { Amplify } from '@aws-amplify/core'

/* build fails - 'userPoolId wrong' , amplify does not like the temp env vars */
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
      endpoints: [{ name: process.env.NEXT_PUBLIC_APIGATEWAY_NAME, endpoint: process.env.NEXT_PUBLIC_API_URL }]
    }
  })
} catch (err) {
  console.log('amplifyConfigErr', err)
}
