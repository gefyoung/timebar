import * as sst from "@serverless-stack/resources"

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    // const UserDays = new sst.Table(this, "UserDays", {
    //   fields: {
    //     user: sst.TableFieldType.STRING,
    //   },
    //   primaryIndex: { partitionKey: "user", /*sortKey: "month"*/ }
    // })
    const UserMonths = new sst.Table(this, 'UserMonths', {
      fields: {
        user: sst.TableFieldType.STRING,
        month: sst.TableFieldType.STRING
      },
      primaryIndex: { partitionKey: "user", sortKey: "month" }
    })


    const auth = new sst.Auth(this, "Auth", {
      cognito: {
        userPool: {
          signInAliases: { email: true },
          passwordPolicy: {             
            minLength: 7,
            requireSymbols: false,
            requireUppercase: false
          }
        }
      }
      // google: {
      //   clientId: process.env.GOOGLE_AUTH_ID || ''
      // }
    })

    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          // UserDays: UserDays.tableName,
          UserMonths: UserMonths.tableName
        },
        timeout: 20
      },
      routes: {
        "POST /getUserMonth": "src/getUserMonth.handler",
        "POST /saveText": "src/saveText.handler",
        "POST /saveDuration": "src/saveDuration.handler",
        "POST /submitEventName": "src/submitEventName.handler",
        "POST /submitEvent": "src/submitEvent.handler",
        "POST /deleteEvent": "src/deleteEvent.handler",
      },
    })

    api.attachPermissions([UserMonths])

    auth.attachPermissionsForAuthUsers([api])

    const site = new sst.NextjsSite(this, "Site", {
      path: "frontend",
      environment: {
        NEXT_PUBLIC_REGION: scope.region,
        NEXT_PUBLIC_API_URL: api.url,
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: auth.cognitoUserPool?.userPoolId ?? 'noPool',
        NEXT_PUBLIC_COGNITO_APP_CLIENT_ID: auth.cognitoUserPoolClient?.userPoolClientId ?? 'noAppClient',
        NEXT_PUBLIC_COGNITO_IDENTITY: auth.cognitoIdentityPoolId,
        NEXT_PUBLIC_APIGATEWAY_NAME: api.httpApi.httpApiName ?? 'noAPI',
      },
    })

    this.addOutputs({
      URL: site.url,
      ApiEndpoint: api.url,
      UserPoolId: auth.cognitoUserPool?.userPoolId??'',
      IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: auth.cognitoUserPoolClient?.userPoolClientId??""
    })
  }
}

