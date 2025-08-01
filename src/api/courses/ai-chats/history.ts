'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { CoursePartChatHistory } from '@/payload-types'
import { Message } from 'ai'

/**
 * Creates a new chat history file on S3 via Payload.
 * @param chatId - The parent chat ID (number)
 * @param initialMessages - Optional array of initial messages
 * @returns The history ID and the S3 URL (if available)
 */
export async function createChatHistory({
  chatId,
  initialMessages = [],
}: {
  chatId: number
  initialMessages?: Message[]
}): Promise<CoursePartChatHistory> {
  const payload = await getPayload({ config })

  const fileContent = Buffer.from(JSON.stringify(initialMessages, null, 2), 'utf-8')

  const result = await payload.create({
    collection: 'course-part-chat-histories',
    data: {
      chat: chatId,
    },
    file: {
      data: fileContent,
      name: `chat-history-${chatId}.json`,
      mimetype: 'application/json',
      size: fileContent.length,
    },
  })

  return result
}

/**
 * Loads the chat history messages from S3 using the ChatHistory id.
 * @param historyId - The ChatHistory id
 * @returns The array of messages (any[])
 */
export async function getChatHistory(historyId: number): Promise<Message[]> {
  const payload = await getPayload({ config })
  const history = await payload.findByID({ collection: 'course-part-chat-histories', id: historyId })
  if (!history.url) return []

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const absoluteUrl = history.url.startsWith('http') ? history.url : `${baseUrl}${history.url}`

  const res = await fetch(absoluteUrl)
  if (!res.ok) return []
  const json = await res.json()
  return json as Message[]
}

/**
 * Updates the chat history file on S3 with a new array of messages.
 * @param historyId - The ChatHistory id
 * @param messages - The new array of messages to store
 * @returns The updated ChatHistory object
 */
export async function updateChatHistory({
  historyId,
  messages,
}: {
  historyId: number
  messages: Message[]
}): Promise<CoursePartChatHistory> {
  const payload = await getPayload({ config })
  const fileContent = Buffer.from(JSON.stringify(messages, null, 2), 'utf-8')
  // Fetch the current document to get the 'chat' field
  const current = await payload.findByID({ collection: 'course-part-chat-histories', id: historyId })
  const updated = await payload.update({
    collection: 'course-part-chat-histories',
    id: historyId,
    data: { chat: current.chat },
    file: {
      data: fileContent,
      name: `chat-history-${historyId}.json`,
      mimetype: 'application/json',
      size: fileContent.length,
    },
  })
  return updated
}

/**
 * Resets the chat history by replacing the file with an empty array.
 * @param historyId - The ChatHistory id
 * @returns The updated ChatHistory object
 */
export async function resetChatHistory(historyId: number): Promise<CoursePartChatHistory> {
  return await updateChatHistory({ historyId, messages: [] })
}

/**
 * Deletes the chat history entry and its file from Payload/S3.
 * @param historyId - The ChatHistory id
 * @returns True if deleted, false otherwise
 */
export async function deleteChatHistory(historyId: number): Promise<boolean> {
  const payload = await getPayload({ config })
  try {
    await payload.delete({ collection: 'course-part-chat-histories', id: historyId })
    return true
  } catch {
    return false
  }
}
