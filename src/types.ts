export interface IAMAuthorizer {
  authorizer: {
    jwt?: {
      claims: {
        claim1: string,
        claim2: string
      },
      scopes: [
        string,
        string
      ]
    },
    iam: {
      cognitoIdentity: {
        identityId: string
      }
    }
  }
}

export interface Event {
  start: number
  duration: number
  eventName: string
  className: string
  text?: string
  eventNameKey?: number
  dayKey: string
  arrayIndex: number
  dayArrayIndex: number
  newStart?: number
}
