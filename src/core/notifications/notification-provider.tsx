'use client'

import { createContext, useContext, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  getReadNotifications,
  setIsRead,
  setAllNotificationsAsRead,
} from '@/core/notifications'
import { useSessionUser } from '@/core/user/hooks/use-user'
import { Notification } from '@/payload-types'

export type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  isError: boolean
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  refetch: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { user, isLoading: isUserLoading } = useSessionUser()
  const userId = user?.id

  // Notifications non lues
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => (userId ? getNotifications(userId) : []),
    enabled: !!userId,
  })

  // Nombre de non lues
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications])

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => (userId ? setIsRead(id, userId) : Promise.reject()),
    // Optimistic update
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousNotifications = queryClient.getQueryData<Notification[]>([
        'notifications',
        userId,
      ])
      if (previousNotifications) {
        queryClient.setQueryData(
          ['notifications', userId],
          previousNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        )
      }
      return { previousNotifications }
    },
    onError: (err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications', userId], context.previousNotifications)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['readNotifications'] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => (userId ? setAllNotificationsAsRead(userId) : Promise.reject()),
    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousNotifications = queryClient.getQueryData<Notification[]>([
        'notifications',
        userId,
      ])
      if (previousNotifications) {
        queryClient.setQueryData(
          ['notifications', userId],
          previousNotifications.map((n) => ({ ...n, isRead: true })),
        )
      }
      return { previousNotifications }
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications', userId], context.previousNotifications)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['readNotifications'] })
    },
  })

  // Méthodes exposées
  const markAsRead = (id: number) => markAsReadMutation.mutate(id)
  const markAllAsRead = () => markAllAsReadMutation.mutate()

  // Fournir le context seulement si userId est dispo
  if (!userId && !isUserLoading) {
    return <>{children}</>
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading: isLoading || isUserLoading,
        isError,
        markAsRead,
        markAllAsRead,
        refetch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider')
  return ctx
}
