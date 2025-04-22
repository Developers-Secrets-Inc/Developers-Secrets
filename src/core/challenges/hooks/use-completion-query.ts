'use client'

import { getChallengeCompletionData } from '@/core/challenges'
import { useQuery } from '@tanstack/react-query'

export function useCompletionQuery(challengeId: number, userId: string, challengeSlug: string) {
  return useQuery({
    queryKey: ['completion', challengeId, userId],
    queryFn: () => getChallengeCompletionData(userId, challengeId, challengeSlug),
    staleTime: Infinity,
    cacheTime: Infinity,
    // On ne veut pas recharger automatiquement
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
