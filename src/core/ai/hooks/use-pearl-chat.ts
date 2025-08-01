'use client'

import { Message, useChat } from '@ai-sdk/react'
import type { ChallengeAiChat } from '@/payload-types'

interface UsePearlChatOptions {
  chatId: number
  initialMessages: Message[]
  onReset: ({ chatId }: { chatId: number }) => Promise<void>
  api?: string
}

export function usePearlChat({ chatId, initialMessages, onReset, api }: UsePearlChatOptions) {
  const chat = useChat({
    id: chatId.toString(),
    initialMessages,
    api: api || '/api/pearl/chat',
    body: {
      chatId: chatId,
    },
  })

  const reset = async () => {
    const previousMessages = chat.messages
    chat.setMessages([])

    try {
      await onReset({ chatId: chatId })
    } catch (e) {
      chat.setMessages(previousMessages)
      console.error('Failed to reset chat:', e)
      throw e
    }
  }

  return { ...chat, reset }
}
