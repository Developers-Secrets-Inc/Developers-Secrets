'use client'

import { useQuery, useMutation } from '@/core/functions/hooks'
import { useQueryClient } from '@tanstack/react-query'
import {
  findUserChallengeEngagement,
  createUserChallengeEngagement,
  updateUserChallengeEngagement,
  removeUserChallengeEngagement,
} from '@/api/challenges/engagement/engagement'
import { ChallengeEngagement } from '@/payload-types'
import { useState } from 'react'

interface UseChallengeEngagementProps {
  userId: string
  challengeId: number
  initial?: ChallengeEngagement
}

export function useChallengeEngagement({
  userId,
  challengeId,
  initial,
}: UseChallengeEngagementProps) {
  const queryClient = useQueryClient()
  const queryKey = [findUserChallengeEngagement.name, { userId, challengeId }]
  
  // État optimiste local
  const [optimisticState, setOptimisticState] = useState<ChallengeEngagement | null>(null)
  
  const { data, isLoading } = useQuery(
    findUserChallengeEngagement,
    { userId, challengeId },
    {
      enabled: !!userId && !!challengeId,
      initialData: initial,
    },
  )

  const createMutation = useMutation(createUserChallengeEngagement, {
    onSuccess: (newData) => {
      // Mettre à jour le cache avec les vraies données du serveur
      queryClient.setQueryData(queryKey, newData)
      setOptimisticState(null)
    },
    onError: () => {
      setOptimisticState(null)
    },
  })
  
  const updateMutation = useMutation(updateUserChallengeEngagement, {
    onSuccess: (newData) => {
      // Mettre à jour le cache avec les vraies données du serveur
      queryClient.setQueryData(queryKey, newData)
      setOptimisticState(null)
    },
    onError: () => {
      setOptimisticState(null)
    },
  })
  
  const removeMutation = useMutation(removeUserChallengeEngagement, {
    onSuccess: () => {
      // Supprimer du cache
      queryClient.setQueryData(queryKey, null)
      setOptimisticState(null)
    },
    onError: () => {
      setOptimisticState(null)
    },
  })

  // Utiliser l'état optimiste s'il existe, sinon les données du serveur
  const currentData = optimisticState || data
  const liked = currentData?.type === 'like'
  const disliked = currentData?.type === 'dislike'
  const engagementId = currentData?.id

  const handleLikeClick = () => {
    if (liked && engagementId) {
      // Supprimer le like - état optimiste: null
      setOptimisticState(null)
      removeMutation.mutate({ engagementId })
    } else if (engagementId) {
      // Changer vers like - état optimiste: like
      setOptimisticState({ ...currentData, type: 'like' })
      updateMutation.mutate({ engagementId, type: 'like' })
    } else {
      // Créer un like - état optimiste: nouveau like
      setOptimisticState({
        id: Date.now(),
        type: 'like',
        userId,
        challenge: challengeId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      createMutation.mutate({ userId, challengeId, type: 'like' })
    }
  }

  const handleDislikeClick = () => {
    if (disliked && engagementId) {
      // Supprimer le dislike - état optimiste: null
      setOptimisticState(null)
      removeMutation.mutate({ engagementId })
    } else if (engagementId) {
      // Changer vers dislike - état optimiste: dislike
      setOptimisticState({ ...currentData, type: 'dislike' })
      updateMutation.mutate({ engagementId, type: 'dislike' })
    } else {
      // Créer un dislike - état optimiste: nouveau dislike
      setOptimisticState({
        id: Date.now(),
        type: 'dislike',
        userId,
        challenge: challengeId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      createMutation.mutate({ userId, challengeId, type: 'dislike' })
    }
  }

  return {
    liked,
    disliked,
    isLoading:
      isLoading || createMutation.isPending || updateMutation.isPending || removeMutation.isPending,
    handleLikeClick,
    handleDislikeClick,
  }
}
