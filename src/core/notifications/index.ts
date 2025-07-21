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

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const payload = await getPayload({ config })

  const notifications = await payload.find({
    collection: 'notifications',
    where: {
      userId: {
        equals: userId,
      },
    },
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

export const setIsRead = async (id: number, userId: string): Promise<void> => {
  const payload = await getPayload({ config })

  const notification = await payload.findByID({
    collection: 'notifications',
    id,
  })
  if (!notification || notification.userId !== userId) {
    throw new Error('Unauthorized: Notification does not belong to this user.')
  }

  await payload.update({
    collection: 'notifications',
    id,
    data: {
      isRead: true,
    },
  })
}

export const setAllNotificationsAsRead = async (userId: string): Promise<void> => {
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
      userId: {
        equals: userId,
      },
    },
  })
}

type PaginationParams = {
  userId: string
  page?: number
  limit?: number
}

export const getReadNotifications = async ({
  userId,
  page = 1,
  limit = 5,
}: PaginationParams): Promise<{
  docs: Notification[]
  totalDocs: number
  currentPage: number
}> => {
  const payload = await getPayload({ config })

  const notifications = await payload.find({
    collection: 'notifications',
    where: {
      isRead: {
        equals: true,
      },
      userId: {
        equals: userId,
      },
    },
    sort: '-createdAt',
    limit,
    page,
  })

  return {
    docs: notifications.docs,
    totalDocs: notifications.totalDocs,
    currentPage: page,
  }
}
