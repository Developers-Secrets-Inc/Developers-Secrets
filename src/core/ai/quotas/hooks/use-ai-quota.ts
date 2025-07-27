'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRemainingMessagesForToday,
  incrementMessagesSentForToday,
  canSendMessage,
} from '../actions'
import { useSessionUser } from '@/core/user/hooks/use-user'
import { getUserRole } from '@/core/user/user-informations'

const quotaKeys = {
  all: ['ai-quota'],
  details: (userId: string) => [...quotaKeys.all, userId, 'details'],
  canSend: (userId: string) => [...quotaKeys.all, userId, 'can-send'],
  role: (userId: string) => [...quotaKeys.all, userId, 'role'],
}

export const useAIQuota = (userId: string, initialData: number) => {
  const queryClient = useQueryClient()

  const { data: remaining, isLoading: isLoadingRemaining } = useQuery({
    queryKey: quotaKeys.details(userId!),
    queryFn: () => getRemainingMessagesForToday(userId!),
    initialData: initialData,
    enabled: !!userId,
  })

  const { data: canSend, isLoading: isLoadingCanSend } = useQuery({
    queryKey: quotaKeys.canSend(userId!),
    queryFn: () => canSendMessage(userId!),
    enabled: !!userId,
  })

  const { data: role, isLoading: isLoadingRole } = useQuery({
    queryKey: quotaKeys.role(userId!),
    queryFn: () => getUserRole(userId!),
    enabled: !!userId,
  })

  const { mutate: increment, ...rest } = useMutation({
    mutationFn: () => {
      if (!userId) {
        throw new Error('User not found')
      }
      return incrementMessagesSentForToday(userId)
    },
    onMutate: async () => {
      if (!userId) return

      await queryClient.cancelQueries({ queryKey: quotaKeys.details(userId) })
      const previousQuota = queryClient.getQueryData<number>(quotaKeys.details(userId))

      if (typeof previousQuota !== 'undefined') {
        queryClient.setQueryData(quotaKeys.details(userId), previousQuota - 1)
      }

      return { previousQuota }
    },
    onError: (err, newTodo, context) => {
      if (!userId) return
      if (context?.previousQuota) {
        queryClient.setQueryData(quotaKeys.details(userId), context.previousQuota)
      }
    },
    onSettled: () => {
      if (!userId) return
      queryClient.invalidateQueries({ queryKey: quotaKeys.details(userId) })
      queryClient.invalidateQueries({ queryKey: quotaKeys.canSend(userId) })
    },
  })

  return {
    remaining,
    canSend,
    role,
    isLoading: isLoadingRemaining || isLoadingCanSend || isLoadingRole,
    increment,
    ...rest,
  }
}
