'use client'

import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '@/core/notifications'
import { Notification } from '@/payload-types'

export const NOTIFICATIONS_QUERY_KEY = ['notifications']

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: getNotifications,
  })
}
