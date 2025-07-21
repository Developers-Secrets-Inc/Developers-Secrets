import { ChallengeEvents } from './handlers/challenges'

type EventPayloads = {
  'challenge.completed': { challengeId: number; userId: string }
}

type EventType = keyof EventPayloads

const eventHandlers: {
  [K in EventType]: ((payload: EventPayloads[K]) => Promise<void>)[]
} = {
  'challenge.completed': ChallengeEvents,
}

export const dispatch = async <K extends EventType>(
  eventType: K,
  payload: EventPayloads[K],
): Promise<void> => {
  const handlers = eventHandlers[eventType] || []
  await Promise.all(handlers.map((fn) => fn(payload)))
}
