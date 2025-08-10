'use client'

import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '@/core/notifications'
import { Notification } from '@/payload-types'
import { useUser } from '@/core/users/hooks/use-user'

export const NOTIFICATIONS_QUERY_KEY = ['notifications']

export function useNotifications() {
  const { user } = useUser()

  return useQuery<Notification[]>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, user?.id],
    queryFn: () => {
      if (!user?.id) return []
      return getNotifications(user.id)
    },
    enabled: !!user?.id,
  })
}
