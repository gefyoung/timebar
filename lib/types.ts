
export interface Day {
  dayKey: string
  dayValue: Event[]
}
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
  id: string
  duration: number
  eventName: string
  text?: string
  eventNameKey?: number
  dayKey: string
  arrayIndex: number
  dayArrayIndex: number
}
