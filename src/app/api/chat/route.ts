import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const openRouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
})

// System prompt building logic is now handled client-side

export async function POST(req: Request) {
  // Extract messages AND systemPrompt from the request body
  const { messages, systemPrompt } = await req.json()

  // Basic validation/fallback for system prompt
  const finalSystemPrompt = typeof systemPrompt === 'string' ? systemPrompt : undefined

  const result = streamText({
    model: openRouter('google/gemma-3-27b-it:free'), // Or your preferred model
    // Pass the system prompt received from the client (or undefined)
    system: finalSystemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
