'use server'

import { Notification } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

type NotificationCreateInput = {
  userId: string
  content: string
  importance: 'high' | 'medium' | 'low'
  type: 'system' | 'challenge' | 'achievement' | 'social'
  actionUrl?: string
  expiresAt?: string
}

export const createNotification = async (input: NotificationCreateInput): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.create({
    collection: 'notifications',
    data: input,
  })
}

export const getNotifications = async (): Promise<Notification[]> => {
  const payload = await getPayload({ config })

  const notifications = await payload.find({
    collection: 'notifications',
  })

  return notifications.docs
}

export const getNotification = async (id: number): Promise<Notification> => {
  const payload = await getPayload({ config })

  const notification = await payload.findByID({
    collection: 'notifications',
    id,
  })

  return notification
}

export const setIsRead = async (id: number): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'notifications',
    id,
    data: {
      isRead: true,
    },
  })
}

export const setAllNotificationsAsRead = async (): Promise<void> => {
  const payload = await getPayload({ config })

  await payload.update({
    collection: 'notifications',
    data: {
      isRead: true,
    },
    where: {
      isRead: {
        equals: false,
      },
    },
  })
}
