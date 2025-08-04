'use client'

import { useQuery } from '@tanstack/react-query'
import { getCoursePartCompletionStatus } from '..'

export const useCoursePartUserStatus = (partId: number, userId: string) => {
  const {
    data: status,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['coursePartStatus', userId, partId],
    queryFn: () => {
      if (!userId || !partId) {
        throw new Error('User ID or Part ID is undefined in queryFn.')
      }
      return getCoursePartCompletionStatus({userId, partId})
    },
    enabled: !!userId && !!partId,
  })

  return {
    status,
    isLoading,
    error,
  }
}
