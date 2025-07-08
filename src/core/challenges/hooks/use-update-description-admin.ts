'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { updateChallengeDescription, getChallengeBySlug } from '../challenge-queries'

interface UseUpdateDescriptionAdminProps {
  slug: string
  initialDescription?: string
}

export const useUpdateDescriptionAdmin = ({ slug, initialDescription: propInitialDescription }: UseUpdateDescriptionAdminProps) => {
  const queryClient = useQueryClient()

  const { data: challengeData, isLoading: isLoadingQuery } = useQuery({
    queryKey: ['challenge', slug],
    queryFn: () => getChallengeBySlug(slug),
    initialData: () => {
      const existingData = queryClient.getQueryData(['challenge', slug])
      if (existingData) return existingData
      // Attempt to construct a minimal Challenge-like object for initialData from propInitialDescription
      // This is primarily for SSR hydration if the prop is available before the first fetch.
      if (propInitialDescription !== undefined) {
        return {
          slug: slug, // Ensure slug is part of the object if needed by consumers of this queryKey
          description: { statement: propInitialDescription },
          // other challenge properties would be undefined here
        } as any // Cast as any because it's a partial object for initialData
      }
      return undefined
    },
  })

  const [currentDescriptionState, setCurrentDescriptionState] = useState(propInitialDescription || '')

  useEffect(() => {
    if (!isLoadingQuery && challengeData?.description?.statement !== undefined) {
      setCurrentDescriptionState(challengeData.description.statement)
    } else if (propInitialDescription !== undefined) {
      // Fallback to prop if query data is not yet available or statement is missing
      setCurrentDescriptionState(propInitialDescription)
    }
  }, [challengeData, propInitialDescription, isLoadingQuery])

  const mutation = useMutation({
    mutationFn: async (newDescription: string) => { // newDescription is the text from the dialog's textarea
      const updatedChallenge = await updateChallengeDescription(slug, newDescription)
      return updatedChallenge
    },
    onMutate: async (newDescription: string) => {
      // Annule toutes les requêtes en cours pour cette clé de requête
      await queryClient.cancelQueries({ queryKey: ['challenge', slug] })

      // Snapshot de la valeur précédente
      const previousChallenge = queryClient.getQueryData(['challenge', slug])

      // Met à jour optimistically
      queryClient.setQueryData(['challenge', slug], (old: any) => { // 'old' is the Challenge object from cache
        // Ensure 'old' is treated as a Challenge-like object for the optimistic update.
        // If 'old' is undefined (e.g., cache miss), create a structure for the optimistic update.
        const currentDescriptionObject = old?.description || {};
        return {
          ...(old || { slug: slug }), // Spread old or a minimal object with slug
          description: {
            ...currentDescriptionObject,
            statement: newDescription,
          },
        };
      })

      return { previousChallenge }
    },
    onError: (err, newDescription, context) => {
      // Revertir l'optimistic update en cas d'erreur
      if (context?.previousChallenge) {
        queryClient.setQueryData(['challenge', slug], context.previousChallenge)
      }
    },
    onSettled: () => {
      // This invalidation will trigger the useQuery within this hook to refetch.
      // The useEffect will then update currentDescriptionState, causing consumers
      // like ChallengeDescriptionContent to re-render with the latest description.
      queryClient.invalidateQueries({ queryKey: ['challenge', slug] })
    },
  })

  return {
    description: currentDescriptionState,
    // setDescription is removed as the dialog should manage its own textarea state.
    // The 'description' returned here is authoritative (from server or optimistic update).
    updateDescription: mutation.mutate, // Expects the new description string as argument
    isUpdating: mutation.isPending,
    error: mutation.error,
    isLoadingDescription: isLoadingQuery, // Consumers might want to know if the description is loading
  }
}