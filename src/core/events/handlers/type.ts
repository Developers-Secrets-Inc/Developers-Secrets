


export type EventHandler<TPayload> = {
  name: string
  events: ((payload: TPayload) => Promise<void>)[]
}
