'use client'

import { Message, useChat } from '@ai-sdk/react'
import type { ChallengeAiChat } from '@/payload-types'
import { resetChat } from '@/core/challenges/ai-chat'

interface UsePearlChatOptions {
  challengeAIChat: ChallengeAiChat
}

export function usePearlChat({ challengeAIChat }: UsePearlChatOptions) {
  const chat = useChat({
    id: challengeAIChat.id.toString(),
    initialMessages: challengeAIChat.messages as Message[],
    api: '/api/challenges/chat',
    body: {
      chatId: challengeAIChat.id,
    },
  })

  const reset = async () => {
    const previousMessages = chat.messages
    chat.setMessages([])

    try {
      await resetChat({ chatId: challengeAIChat.id })
    } catch (e) { 
      chat.setMessages(previousMessages)
      console.error('Failed to reset chat:', e)
      throw e
    }
  }

  return { ...chat, reset }
}
