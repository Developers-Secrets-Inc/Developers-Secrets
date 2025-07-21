'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { createChatHistory, getChatHistory, resetChatHistory, updateChatHistory } from './history'
import type { Message } from 'ai'

// Récupère ou crée une conversation Pearl pour un user/challenge donné
export async function getOrCreateChat({
  userId,
  challenge,
}: {
  userId: string
  challenge: number
}) {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'challenge-ai-chats',
    where: {
      userId: { equals: userId },
      challenge: { equals: challenge },
    },
    limit: 1,
  })

  if (existing.docs && existing.docs.length > 0) {
    return existing.docs[0]
  }

  const created = await payload.create({
    collection: 'challenge-ai-chats',
    data: {
      userId,
      challenge,
    },
  })

  const history = await createChatHistory({ chatId: created.id })
  const updated = await payload.update({
    collection: 'challenge-ai-chats',
    id: created.id,
    data: { chatHistory: history.id },
  })

  return updated
}

// Load the chat history messages for a chat by its id
export async function loadChat({ chatId }: { chatId: number }): Promise<Message[]> {
  const payload = await getPayload({ config })
  const chat = await payload.findByID({ collection: 'challenge-ai-chats', id: chatId })

  if (chat.chatHistory) {
    const historyId =
      typeof chat.chatHistory === 'object' && chat.chatHistory !== null
        ? chat.chatHistory.id
        : chat.chatHistory
    return await getChatHistory(historyId)
  }

  return []
}

// Sauvegarde l'historique complet des messages pour un chat donné
export async function saveChat({ chatId, messages }: { chatId: number; messages: Message[] }) {
  const payload = await getPayload({ config })
  const chat = await payload.findByID({ collection: 'challenge-ai-chats', id: chatId })
  if (!chat.chatHistory) throw new Error('No chatHistory found for this chat')
  const historyId =
    typeof chat.chatHistory === 'object' && chat.chatHistory !== null
      ? chat.chatHistory.id
      : chat.chatHistory
  return await updateChatHistory({ historyId, messages })
}

// Réinitialise l'historique d'un chat (vide les messages)
export async function resetChat({ chatId }: { chatId: number }) {
  const payload = await getPayload({ config })
  const chat = await payload.findByID({ collection: 'challenge-ai-chats', id: chatId })
  if (!chat.chatHistory) throw new Error('No chatHistory found for this chat')
  const historyId =
    typeof chat.chatHistory === 'object' && chat.chatHistory !== null
      ? chat.chatHistory.id
      : chat.chatHistory
  return await resetChatHistory(historyId)
}
