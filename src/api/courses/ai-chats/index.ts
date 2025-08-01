'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { createChatHistory, getChatHistory, resetChatHistory, updateChatHistory } from './history'
import type { Message } from 'ai'

export async function getOrCreateChat({
  userId,
  coursePart,
}: {
  userId: string
  coursePart: number
}) {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'course-part-ai-chats',
    where: {
      userId: { equals: userId },
      coursePart: { equals: coursePart },
    },
    limit: 1,
  })

  if (existing.docs && existing.docs.length > 0) {
    return existing.docs[0]
  }

  const created = await payload.create({
    collection: 'course-part-ai-chats',
    data: {
      userId,
      coursePart,
    },
  })

  const history = await createChatHistory({ chatId: created.id })
  const updated = await payload.update({
    collection: 'course-part-ai-chats',
    id: created.id,
    data: { chatHistory: history.id },
  })

  return updated
}

export async function loadChat({ chatId }: { chatId: number }): Promise<Message[]> {
  const payload = await getPayload({ config })
  const chat = await payload.findByID({ collection: 'course-part-ai-chats', id: chatId })

  if (chat.chatHistory) {
    const historyId =
      typeof chat.chatHistory === 'object' && chat.chatHistory !== null
        ? chat.chatHistory.id
        : chat.chatHistory
    return await getChatHistory(historyId)
  }

  return []
}

export async function saveChat({ chatId, messages }: { chatId: number; messages: Message[] }) {
  const payload = await getPayload({ config })
  const chat = await payload.findByID({ collection: 'course-part-ai-chats', id: chatId })
  if (!chat.chatHistory) throw new Error('No chatHistory found for this chat')
  const historyId =
    typeof chat.chatHistory === 'object' && chat.chatHistory !== null
      ? chat.chatHistory.id
      : chat.chatHistory
  return await updateChatHistory({ historyId, messages })
}

export async function resetChat({ chatId }: { chatId: number }) {
  const payload = await getPayload({ config })
  const chat = await payload.findByID({ collection: 'course-part-ai-chats', id: chatId })
  if (!chat.chatHistory) throw new Error('No chatHistory found for this chat')
  const historyId =
    typeof chat.chatHistory === 'object' && chat.chatHistory !== null
      ? chat.chatHistory.id
      : chat.chatHistory
  return await resetChatHistory(historyId)
}
