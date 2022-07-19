import { Amplify } from '@aws-amplify/core'

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
  console.log('amplifyConfigErr', err)
}
