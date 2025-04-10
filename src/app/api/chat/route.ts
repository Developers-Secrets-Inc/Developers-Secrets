import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const openRouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openRouter('mistralai/mistral-small-3.1-24b-instruct:free'),
    messages,
  })

  return result.toDataStreamResponse()
}
