export interface FlipEvent {
  dayBegins?: number
  start: number
  duration: number
  summary: string
  className: string
  text: string
}
export interface Day {
  dayKey: string
  dayValue: FlipEvent[]
  dayText?: string
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