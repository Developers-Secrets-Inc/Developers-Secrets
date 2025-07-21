import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challengeSlug = searchParams.get('slug')

  if (!challengeSlug) {
    return new Response('Challenge slug is required', { status: 400 })
  }

  // Set headers for SSE
  const encoder = new TextEncoder()
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()

  // Send initial connection message
  const initialData = {
    type: 'connection',
    message: 'Connected to comments stream',
    timestamp: new Date().toISOString(),
  }

  writer.write(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`))

  // Example of how you would track SSE connections in a more complete implementation
  // In a real application, this would be handled with Redis, database, or in-memory store
  const connectionKey = `comment-connection-${challengeSlug}-${Date.now()}`
  console.log(`New SSE connection established: ${connectionKey}`)

  // In a real implementation, you would close the connection if the client disconnects
  request.signal.addEventListener('abort', () => {
    console.log(`SSE connection closed: ${connectionKey}`)
    writer.close()
  })

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
