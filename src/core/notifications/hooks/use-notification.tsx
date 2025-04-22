'use client'

import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '@/core/notifications'
import { Notification } from '@/payload-types'
import { getSessionUser } from '@/core/user'

export const NOTIFICATIONS_QUERY_KEY = ['notifications']

export function useNotifications() {
  const { data: user } = useQuery({
    queryKey: ['session'],
    queryFn: getSessionUser,
  })

  return useQuery<Notification[]>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, user?.id],
    queryFn: () => {
      if (!user?.id) return []
      return getNotifications(user.id)
    },
    enabled: !!user?.id,
  })
}
