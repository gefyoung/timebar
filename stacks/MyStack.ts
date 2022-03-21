import * as sst from "@serverless-stack/resources"

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    const UserDays = new sst.Table(this, "UserDays", {
      fields: {
        user: sst.TableFieldType.STRING,
        // month: sst.TableFieldType.STRING
      },
      primaryIndex: { partitionKey: "user", /*sortKey: "month"*/ }
    })

    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          UserDays: UserDays.tableName
        },
        timeout: 20
      },
      routes: {
        "GET /getIcal": {
          // timeout: 20,
          function: "src/getIcal.handler"
        },
        "POST /saveFlip": "src/saveFlip.handler"
      },
    })
    api.attachPermissions([UserDays])

    const site = new sst.NextjsSite(this, "Site", {
      path: "frontend",
      environment: {
        // Pass the table details to our app
        REGION: scope.region,
        TABLE_NAME: UserDays.tableName,
      },
    })

    site.attachPermissions([UserDays])

    // Show the endpoint in the output
    this.addOutputs({
      URL: site.url,
      "ApiEndpoint": api.url,
    })
  }
}
