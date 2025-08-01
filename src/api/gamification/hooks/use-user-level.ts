'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserLevel } from '../level'

export const useUserLevel = (userId: string) => {
  return useQuery({
    queryKey: ['user-level', userId],
    queryFn: () => getUserLevel({ userId }),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!userId,
  })
}