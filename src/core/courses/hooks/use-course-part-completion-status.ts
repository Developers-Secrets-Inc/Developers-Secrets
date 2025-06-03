'use client'

import { useCallback } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
// Importer les actions serveur fournies
import {
  getUserPartCompletionStatus,
  updateUserPartCompletionStatus,
} from '@/core/courses/progression/completion-status' // Ajuste le chemin si nécessaire
import { toast } from 'sonner'

// Définir et exporter le type
export type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

interface UseCompletionStatusProps {
  partId: number
  userId: string // Doit être une string valide pour l'appel
  initialStatus?: CompletionStatus
  enabled?: boolean
}

// Clé de query unique pour le statut de complétion
const getCompletionStatusQueryKey = (userId: string, partId: number) => [
  'completionStatus',
  userId,
  partId,
]

/**
 * Hook pour gérer l'état de complétion d'une partie de cours avec mises à jour optimistes.
 */
export function useCoursePartCompletionStatus({
  partId,
  userId,
  initialStatus,
  enabled = true,
}: UseCompletionStatusProps) {
  const queryClient = useQueryClient()

  // Utilisation d'une valeur par défaut 'not_started' pour initialStatus si non défini
  const defaultStatus: CompletionStatus = initialStatus ?? 'not_started'

  // Exposer isLoading comme isInitialLoading
  const { data: currentStatus = defaultStatus, isLoading: isInitialLoading } =
    useQuery<CompletionStatus>({
      queryKey: getCompletionStatusQueryKey(userId, partId),
      queryFn: () => getUserPartCompletionStatus(userId, partId),
      initialData: defaultStatus,
      enabled: enabled && !!userId,
      staleTime: 5 * 60 * 1000, // Exemple: 5 minutes
      refetchOnWindowFocus: true,
    })

  // Mutation pour mettre à jour le statut
  const mutation = useMutation({
    mutationFn: (newStatus: CompletionStatus) => {
      if (!userId) return Promise.reject(new Error('User ID is missing'))
      return updateUserPartCompletionStatus(userId, partId, newStatus)
    },

    onMutate: async (newStatus: CompletionStatus) => {
      if (!userId) return
      await queryClient.cancelQueries({ queryKey: getCompletionStatusQueryKey(userId, partId) })
      const previousStatus = queryClient.getQueryData<CompletionStatus>(
        getCompletionStatusQueryKey(userId, partId),
      )
      queryClient.setQueryData(getCompletionStatusQueryKey(userId, partId), newStatus)
      return { previousStatus }
    },

    onError: (error: Error, newStatus, context) => {
      if (!userId) return
      const errorMsg = error.message
      toast.error(`Failed to update status: ${errorMsg}`)
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          getCompletionStatusQueryKey(userId, partId),
          context.previousStatus,
        )
      }
    },

    onSuccess: (data) => {
      if (!userId) return
      if (data?.completionStatus) {
        queryClient.setQueryData(getCompletionStatusQueryKey(userId, partId), data.completionStatus)
      } else {
        queryClient.invalidateQueries({ queryKey: getCompletionStatusQueryKey(userId, partId) })
      }
    },
  })

  // Fonction exposée pour mettre à jour le statut
  const updateStatus = useCallback(
    (newStatus: CompletionStatus) => {
      if (!userId) return
      mutation.mutate(newStatus)
    },
    [mutation, userId],
  )

  return {
    status: currentStatus,
    updateStatus,
    isLoading: mutation.isPending,
    isInitialLoading: isInitialLoading,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  }
}
