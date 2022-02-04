import * as sst from "@serverless-stack/resources"

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    const table = new sst.Table(this, "Counter", {
      fields: {
        counter: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "user" },
    })

    const api = new sst.Api(this, "Api", {
      routes: {
        "GET /getIcal": "src/lambda.handler",
      },
    })

    const site = new sst.NextjsSite(this, "Site", {
      path: "frontend",
      environment: {
        // Pass the table details to our app
        REGION: scope.region,
        TABLE_NAME: table.tableName,
      },
    })

    site.attachPermissions([table])

    // Show the endpoint in the output
    this.addOutputs({
      URL: site.url,
      "ApiEndpoint": api.url,
    })
  }
}
