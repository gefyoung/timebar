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

