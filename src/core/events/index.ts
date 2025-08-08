import { Challenge } from '@/payload-types';
import { ChallengeEvents } from './handlers/challenges'
import { User } from '../users/types';

type EventPayloads = {
  'challenge.completed': { challenge: Challenge; user: User }
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
