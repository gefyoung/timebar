import * as iam from "aws-cdk-lib/aws-iam";
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
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      routes: {
        "POST /getUserMonth": "src/getUserMonth.handler",
        "POST /saveText": "src/saveText.handler",
        "POST /updateEventArray": "src/updateEventArray.handler",
        "POST /submitEventName": "src/submitEventName.handler",
        "POST /submitEvent": "src/submitEvent.handler",
        "POST /deleteEvent": "src/deleteEvent.handler",
        "POST /deleteEventName": "src/deleteEventName.handler",
        "POST /updateDuration": "src/updateDuration.handler",
        "POST /updateArrayIndex": "src/updateArrayIndex.handler",
      },
    })

    api.attachPermissions([UserMonths])

    auth.attachPermissionsForAuthUsers([api])
    auth.attachPermissionsForUnauthUsers([
      new iam.PolicyStatement({
        actions: ["execute-api:Invoke"],
        effect: iam.Effect.ALLOW,
        resources: [
          `arn:aws:execute-api:${scope.region}:${scope.account}:${api.httpApi.apiId}/getUserMonth`
        ]
      })
    ])

    const site = new sst.NextjsSite(this, "Site", {
      path: "frontend",
      environment: {
        NEXT_PUBLIC_REGION: scope.region,
        NEXT_PUBLIC_API_URL: api.url,
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: auth.cognitoUserPool?.userPoolId ?? 'noPool',
        NEXT_PUBLIC_COGNITO_APP_CLIENT_ID: auth.cognitoUserPoolClient?.userPoolClientId ?? 'noAppClient',
        NEXT_PUBLIC_COGNITO_IDENTITY: auth.cognitoIdentityPoolId,
        NEXT_PUBLIC_APIGATEWAY_NAME: api.httpApi.httpApiName ?? 'noAPI',
        NEXT_PUBLIC_FATHOM_SITE_ID: scope.stage === "prod" ? 'PGUABNQP' : "",
        NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS: "timebar.me"
      },
      customDomain: scope.stage === "prod" ? {
        domainName: "timebar.me",
        domainAlias: "www.timebar.me",
      } : undefined
      // customDomain: scope.stage === "prod" ? "timebar.me" : undefined
    })


    this.addOutputs({
      URL: site.url,
      ApiEndpoint: api.url,
      UserPoolId: auth.cognitoUserPool?.userPoolId ?? '',
      IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: auth.cognitoUserPoolClient?.userPoolClientId ?? ""
    })
  }
}

