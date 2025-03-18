// Utilities for pushing events to SSE clients

// In a real application, this would be stored in a database, Redis, or other data store
// This is a simplified in-memory implementation for demonstration purposes
const SSE_CONNECTIONS = new Map<string, Set<any>>()

type EventData = {
  type: string
  payload: any
}

/**
 * Register a new SSE connection
 * @param channel The channel to register the connection to (e.g., 'comments-challenge-123')
 * @param connection The connection object (e.g., writer, response, etc.)
 */
export function registerSSEConnection(channel: string, connection: any): void {
  if (!SSE_CONNECTIONS.has(channel)) {
    SSE_CONNECTIONS.set(channel, new Set())
  }
  SSE_CONNECTIONS.get(channel)?.add(connection)
  console.log(
    `Registered SSE connection for channel: ${channel}. Total: ${SSE_CONNECTIONS.get(channel)?.size}`,
  )
}

/**
 * Unregister an SSE connection
 * @param channel The channel to unregister from
 * @param connection The connection to unregister
 */
export function unregisterSSEConnection(channel: string, connection: any): void {
  const channelConnections = SSE_CONNECTIONS.get(channel)
  if (channelConnections) {
    channelConnections.delete(connection)
    console.log(
      `Unregistered SSE connection for channel: ${channel}. Remaining: ${channelConnections.size}`,
    )
    if (channelConnections.size === 0) {
      SSE_CONNECTIONS.delete(channel)
    }
  }
}

/**
 * Push an event to all clients subscribed to a channel
 * @param channel The channel to push to
 * @param event The event name
 * @param data The event data
 */
export async function pushEventToChannel(channel: string, event: string, data: any): Promise<void> {
  const channelConnections = SSE_CONNECTIONS.get(channel)
  if (!channelConnections || channelConnections.size === 0) {
    console.log(`No connections for channel: ${channel}`)
    return
  }

  const eventData = JSON.stringify({
    type: event,
    payload: data,
    timestamp: new Date().toISOString(),
  })

  const eventString = `event: ${event}\ndata: ${eventData}\n\n`

  console.log(`Pushing event to ${channelConnections.size} connections on channel: ${channel}`)

  // In a real app, this would handle connection errors and retry logic
  for (const connection of channelConnections) {
    try {
      // Write to the connection
      // This is a simplified example - actual implementation depends on your framework
      await connection.write(new TextEncoder().encode(eventString))
    } catch (error) {
      console.error(`Error pushing event to connection: ${error}`)
      // Remove failed connection
      unregisterSSEConnection(channel, connection)
    }
  }
}

/**
 * Helper function to push a comment event
 * @param challengeSlug The challenge slug
 * @param commentData The comment data
 */
export async function pushCommentEvent(challengeSlug: string, commentData: any): Promise<void> {
  const channel = `comments-${challengeSlug}`
  await pushEventToChannel(channel, 'comment', commentData)

  // Also trigger revalidation to update ISR cache
  await fetch('/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: `/challenges/${challengeSlug}/description`,
      secret: process.env.REVALIDATION_SECRET || 'default-secret-change-me',
    }),
  })
}

/**
 * Helper function to push a solution event
 * @param challengeSlug The challenge slug
 * @param solutionData The solution data
 */
export async function pushSolutionEvent(challengeSlug: string, solutionData: any): Promise<void> {
  const channel = `solutions-${challengeSlug}`
  await pushEventToChannel(channel, 'solution', solutionData)

  // Also trigger revalidation to update ISR cache
  await fetch('/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: `/challenges/${challengeSlug}/solutions`,
      secret: process.env.REVALIDATION_SECRET || 'default-secret-change-me',
    }),
  })
}
