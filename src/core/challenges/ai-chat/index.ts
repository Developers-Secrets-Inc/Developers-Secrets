'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

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
      messages: [],
    },
  })

  return created
}

// Charge l'historique des messages d'un chat à partir de son id
export async function loadChat({ chatId }: { chatId: number }) {
  const payload = await getPayload({ config })
  const chat = await payload.findByID({ collection: 'challenge-ai-chats', id: chatId })
  return chat.messages || []
}

// Sauvegarde l'historique complet des messages pour un chat donné
export async function saveChat({ chatId, messages }: { chatId: number; messages: any[] }) {
  const payload = await getPayload({ config })
  await payload.update({
    collection: 'challenge-ai-chats',
    id: chatId,
    data: { messages },
  })
}

// Réinitialise l'historique d'un chat (vide les messages)
export async function resetChat({ chatId }: { chatId: number }) {
  const payload = await getPayload({ config })
  const chat = await payload.update({
    collection: 'challenge-ai-chats',
    id: chatId,
    data: { messages: [] },
  })
  return chat
}
