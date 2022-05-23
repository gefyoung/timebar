export interface Event {
  start: number
  duration: number
  eventName: string
  className: string
  text?: string
  eventNameKey?: number
  dayKey: string
}
export interface Day {
  dayKey: string
  dayValue: Event[]
  dayText?: string
}

export interface UserData {
  user: string
  month: string
  days: Day[]
  events: string[]
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: string;
    NEXT_PUBLIC_REGION: string;
    NEXT_PUBLIC_COGNITO_APP_CLIENT_ID: string
    NEXT_PUBLIC_COGNITO_IDENTITY: string
    NEXT_PUBLIC_APIGATEWAY_NAME: string
  }
}