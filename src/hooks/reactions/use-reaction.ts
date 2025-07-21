'use client'

import { useCallback } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
// Importer la fonction serveur de mutation mise à jour
import { updateUserPartReaction } from '@/core/courses/engagement/reactions' // Ajuste le chemin
// Importer la fonction serveur pour récupérer le statut initial (inchangé)
import { getUserPartReaction } from '@/core/courses/engagement/reactions' // Ajuste le chemin
import { toast } from 'sonner'

// Ce hook gère UNIQUEMENT les réactions sur les parties de cours (partId)
type ReactionStatus = 'liked' | 'disliked' | 'none'

interface UsePartReactionProps {
  partId: number // L'ID de la partie de cours
  userId: string
  initialUserReaction: ReactionStatus
}

// Clé de query unique pour react-query (par utilisateur et partId)
const getPartReactionStatusQueryKey = (userId: string, partId: number) => [
  'reactionStatus',
  userId,
  partId,
]

export function usePartReaction({ partId, userId, initialUserReaction }: UsePartReactionProps) {
  const queryClient = useQueryClient()

  // 1. Utiliser useQuery pour récupérer et s'abonner au statut
  const { data: currentUserReaction = initialUserReaction, isLoading: isInitialLoading } =
    useQuery<ReactionStatus>({
      queryKey: getPartReactionStatusQueryKey(userId, partId),
      queryFn: () => getUserPartReaction(userId, partId),
      initialData: initialUserReaction,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })

  // 2. La mutation reste similaire
  const mutation = useMutation({
    mutationFn: async (newStatus: ReactionStatus) => {
      const result = await updateUserPartReaction(userId, partId, newStatus)
      if (!result.success) {
        throw new Error(result.error || 'Server update failed')
      }
    },

    onMutate: async (newStatus: ReactionStatus) => {
      await queryClient.cancelQueries({ queryKey: getPartReactionStatusQueryKey(userId, partId) })
      const previousStatus = queryClient.getQueryData<ReactionStatus>(
        getPartReactionStatusQueryKey(userId, partId),
      )
      queryClient.setQueryData(getPartReactionStatusQueryKey(userId, partId), newStatus)
      return { previousStatus }
    },

    onError: (error: Error, newStatus, context) => {
      const errorMsg = error.message
      console.error('Reaction update failed:', errorMsg)
      toast.error(`Error: ${errorMsg}`)
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          getPartReactionStatusQueryKey(userId, partId),
          context.previousStatus,
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getPartReactionStatusQueryKey(userId, partId) })
    },
  })

  // 3. handleEngagement utilise maintenant directement currentUserReaction (venant de useQuery)
  const handleEngagement = useCallback(
    (requestedAction: 'like' | 'dislike') => {
      let finalNewStatus: ReactionStatus = 'none'
      if (requestedAction === 'like') {
        finalNewStatus = currentUserReaction === 'liked' ? 'none' : 'liked'
      } else {
        finalNewStatus = currentUserReaction === 'disliked' ? 'none' : 'disliked'
      }
      mutation.mutate(finalNewStatus)
    },
    [mutation, currentUserReaction],
  )

  const handleLikeClick = useCallback(() => {
    handleEngagement('like')
  }, [handleEngagement])
  const handleDislikeClick = useCallback(() => {
    handleEngagement('dislike')
  }, [handleEngagement])

  // 4. L'état retourné utilise directement currentUserReaction de useQuery
  return {
    state: {
      userReaction: currentUserReaction,
      isLoadingMutation: mutation.isPending,
      isInitialLoading: isInitialLoading,
      error: mutation.isError
        ? mutation.error instanceof Error
          ? mutation.error.message
          : 'An error occurred'
        : null,
    },
    actions: { handleLikeClick, handleDislikeClick },
  }
}
