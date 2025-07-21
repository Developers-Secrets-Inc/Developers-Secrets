// Utility for real-time updates to complement ISR

type EventCallback = (data: any) => void

/**
 * Client-side utility for connecting to Server-Sent Events
 * @param endpoint The SSE endpoint URL
 * @param eventType The event type to listen for
 * @param callback The callback to execute when an event is received
 * @returns A function to close the connection
 */
export function subscribeToEvents(
  endpoint: string,
  eventType: string,
  callback: EventCallback,
): () => void {
  if (typeof window === 'undefined') {
    console.warn('Cannot subscribe to events on the server')
    return () => {}
  }

  const eventSource = new EventSource(endpoint)

  eventSource.addEventListener(eventType, ((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      callback(data)
    } catch (error) {
      console.error('Error parsing event data:', error)
    }
  }) as EventListener)

  eventSource.addEventListener('error', () => {
    console.error('Error in SSE connection, reconnecting in 5s...')
    eventSource.close()
    // Try to reconnect after 5 seconds
    setTimeout(() => {
      subscribeToEvents(endpoint, eventType, callback)
    }, 5000)
  })

  // Return a function to close the connection
  return () => {
    eventSource.close()
  }
}

/**
 * Client-side utility for subscribing to specific challenge updates
 * @param challengeSlug The challenge ID to subscribe to
 * @param callback The callback to execute when an update is received
 * @returns A function to close the connection
 */
export function subscribeToChallengeUpdates(
  challengeSlug: string,
  callback: EventCallback,
): () => void {
  const endpoint = `/api/events/challenge?slug=${challengeSlug}`
  return subscribeToEvents(endpoint, 'update', callback)
}

/**
 * Client-side utility for subscribing to comments updates
 * @param challengeSlug The challenge ID to subscribe to comments for
 * @param callback The callback to execute when a new comment is received
 * @returns A function to close the connection
 */
export function subscribeToComments(challengeSlug: string, callback: EventCallback): () => void {
  const endpoint = `/api/events/comments?slug=${challengeSlug}`
  return subscribeToEvents(endpoint, 'comment', callback)
}

/**
 * Client-side utility for subscribing to solution updates
 * @param challengeSlug The challenge ID to subscribe to solutions for
 * @param callback The callback to execute when a new solution is received
 * @returns A function to close the connection
 */
export function subscribeToSolutions(challengeSlug: string, callback: EventCallback): () => void {
  const endpoint = `/api/events/solutions?slug=${challengeSlug}`
  return subscribeToEvents(endpoint, 'solution', callback)
}
