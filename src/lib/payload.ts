import payload from 'payload'
import { getPayload } from 'payload/dist/payload'

// Cache the client promise to avoid multiple instances
let cachedPayloadClient: Promise<typeof payload> | null = null

export const getPayloadClient = async (): Promise<typeof payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing')
  }

  if (cachedPayloadClient) {
    return cachedPayloadClient
  }

  // If we're in a Node.js environment (server-side)
  if (typeof window === 'undefined') {
    // For server-side operations, we want to use the singleton
    const { default: payload } = await import('payload')

    // If payload has already been initialized globally, use it
    if (payload.initialized) {
      cachedPayloadClient = Promise.resolve(payload)
      return cachedPayloadClient
    }

    // Otherwise, initialize it
    cachedPayloadClient = Promise.resolve(payload)
    return cachedPayloadClient
  }

  // This should never happen in a server component/action
  throw new Error('Payload client can only be accessed server-side')
}
