'use client'

import { useCallback } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
// Importer la fonction serveur de mutation mise à jour
import { updateUserPartReaction } from '@/core/courses/engagement/reactions' // Ajuste le chemin
// Importer la fonction serveur pour récupérer le statut initial (inchangé)
import { getUserPartReaction } from '@/core/courses/engagement/reactions' // Ajuste le chemin
import { toast } from 'sonner'

type ReactionStatus = 'liked' | 'disliked' | 'none'

interface UseReactionProps {
  // L'ID de l'élément (partie de cours ou challenge)
  // Renommé en 'itemId' pour la généricité, mais correspondra à 'partId' pour les fonctions serveur actuelles
  itemId: number
  userId: string
  // Les props initiales sont utiles mais react-query peut aussi gérer le fetch initial
  // On les garde pour l'instant pour initialiser l'affichage avant le premier fetch de react-query
  initialUserReaction: ReactionStatus
}

// Définir des clés de query uniques pour react-query
const getReactionStatusQueryKey = (userId: string, itemId: number) => [
  'reactionStatus',
  userId,
  itemId,
]

export function useReaction({ itemId, userId, initialUserReaction }: UseReactionProps) {
  const queryClient = useQueryClient()

  // 1. Utiliser useQuery pour récupérer et s'abonner au statut
  const { data: currentUserReaction = initialUserReaction, isLoading: isInitialLoading } =
    useQuery<ReactionStatus>({
      queryKey: getReactionStatusQueryKey(userId, itemId),
      // La fonction pour fetch la donnée si elle n'est pas dans le cache ou est invalidée
      queryFn: () => getUserPartReaction(userId, itemId),
      // Donnée initiale à afficher avant le premier fetch réussi
      initialData: initialUserReaction,
      // Options pour éviter des refetch inutiles juste pour le statut
      staleTime: Infinity, // Considère la donnée comme fraîche indéfiniment côté client
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })

  // 2. La mutation reste similaire
  const mutation = useMutation({
    mutationFn: async (newStatus: ReactionStatus) => {
      const result = await updateUserPartReaction(userId, itemId, newStatus)
      if (!result.success) {
        throw new Error(result.error || 'Server update failed')
      }
      // No need to return status if invalidating
      // return result.newUserStatus;
    },

    onMutate: async (newStatus: ReactionStatus) => {
      await queryClient.cancelQueries({ queryKey: getReactionStatusQueryKey(userId, itemId) })
      const previousStatus = queryClient.getQueryData<ReactionStatus>(
        getReactionStatusQueryKey(userId, itemId),
      )
      // Mise à jour optimiste via setQueryData
      queryClient.setQueryData(getReactionStatusQueryKey(userId, itemId), newStatus)
      return { previousStatus }
    },

    onError: (error: Error, newStatus, context) => {
      const errorMsg = error.message
      console.error('Reaction update failed:', errorMsg)
      toast.error(`Error: ${errorMsg}`)
      // Rollback
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(getReactionStatusQueryKey(userId, itemId), context.previousStatus)
      }
    },

    // Always invalidate in onSettled to get the source of truth after mutation attempt
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getReactionStatusQueryKey(userId, itemId) })
    },
  })

  // 3. handleEngagement utilise maintenant directement currentUserReaction (venant de useQuery)
  const handleEngagement = useCallback(
    (requestedAction: 'like' | 'dislike') => {
      // currentUserReaction est l'état actuel venant de useQuery (ou initialData)
      let finalNewStatus: ReactionStatus = 'none'
      if (requestedAction === 'like') {
        finalNewStatus = currentUserReaction === 'liked' ? 'none' : 'liked'
      } else {
        finalNewStatus = currentUserReaction === 'disliked' ? 'none' : 'disliked'
      }
      mutation.mutate(finalNewStatus)
    },
    [mutation, currentUserReaction], // Dépendance à currentUserReaction (l'état actuel)
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
      userReaction: currentUserReaction, // Directement depuis useQuery
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
