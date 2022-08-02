import * as iam from "aws-cdk-lib/aws-iam";
import { StackContext, Table, Auth, Api, NextjsSite } from "@serverless-stack/resources"

export default function MyStack({ stack }: StackContext) {


  const MonthDays = new Table(stack, 'MonthDays', {
    fields: {
      userId: "string",
      monthYear: "string"
    },
    primaryIndex: { partitionKey: "userId", sortKey: "monthYear" }
  })
  const UserTable = new Table(stack, 'PublicUsers', {
    fields: {
      userAlias: "string",
    },
    primaryIndex: { partitionKey: "userAlias" }
  })

  const auth = new Auth(stack, "Auth", {
    login: ["email"],
  })

  const api = new Api(stack, "Api", {

    defaults: {
      function: {
        environment: {
          UserMonths: MonthDays.tableName,
          PublicUsers: UserTable.tableName,
        },
        runtime: "nodejs16.x"
      },
      authorizer: "iam"
    },
    routes: {
      "POST /getUserMonth": "src/getUserMonth.handler",
      "POST /getPublicUserMonth": {
        function: "src/getPublicUserMonth.handler",
        // authorizer: "none",
        environment: { STAGE: stack.stage }
      },
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

  api.attachPermissionsToRoute("POST /getUserMonth", [])

  api.attachPermissions([MonthDays, UserTable])

  auth.attachPermissionsForAuthUsers(stack, [api])
  auth.attachPermissionsForUnauthUsers(stack, [
    new iam.PolicyStatement({
      actions: ["execute-api:Invoke"],
      effect: iam.Effect.ALLOW,
      resources: [
        `arn:aws:execute-api:${stack.region}:${stack.account}:${api.httpApiId}/getUserMonth`
      ]
    })
  ])

  const site = new NextjsSite(stack, "Site", {
    path: "frontend",
    defaults: {
      function: {
        runtime: "nodejs16.x"
      }
    },
    environment: {
      NEXT_PUBLIC_REGION: stack.region,
      NEXT_PUBLIC_API_URL: api.url,
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: auth.userPoolId?? "",
      NEXT_PUBLIC_COGNITO_APP_CLIENT_ID: auth.userPoolClientId?? "",
      NEXT_PUBLIC_COGNITO_IDENTITY: auth.cognitoIdentityPoolId ?? "",
      NEXT_PUBLIC_APIGATEWAY_NAME: api.httpApiId,
      NEXT_PUBLIC_FATHOM_SITE_ID: stack.stage === "prod" ? process.env.NEXT_PUBLIC_FATHOM_ID ?? "" : "",
      NEXT_PUBLIC_FATHOM_CUSTOM_URL: stack.stage === "prod" ? process.env.NEXT_PUBLIC_FATHOM_CUSTOM_URL ?? "" : ""
    },
    customDomain: stack.stage === "prod" ? {
      domainName: process.env.DOMAIN_NAME ?? "",
      domainAlias: process.env.DOMAIN_ALIAS,
    } : undefined
  })


  stack.addOutputs({
    URL: site.url,
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId?? "",
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId
  })
}
// }

