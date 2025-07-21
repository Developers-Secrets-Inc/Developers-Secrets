'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { updateChallengeOfficialSolution, getChallengeBySlug } from '../challenge-queries'

interface UseUpdateSolutionAdminProps {
  slug: string
  initialSolution?: string
}

export const useUpdateSolutionAdmin = ({ slug, initialSolution: propInitialSolution }: UseUpdateSolutionAdminProps) => {
  const queryClient = useQueryClient()

  const { data: challengeData, isLoading: isLoadingQuery } = useQuery({
    queryKey: ['challenge', slug],
    queryFn: () => getChallengeBySlug(slug),
    initialData: () => {
      const existingData = queryClient.getQueryData(['challenge', slug])
      if (existingData) return existingData
      if (propInitialSolution !== undefined) {
        return {
          slug: slug,
          officialSolution: { statement: propInitialSolution },
        } as any
      }
      return undefined
    },
  })

  const [currentSolutionState, setCurrentSolutionState] = useState(propInitialSolution || '')

  useEffect(() => {
    if (!isLoadingQuery && challengeData?.officialSolution?.statement !== undefined) {
      setCurrentSolutionState(challengeData.officialSolution.statement)
    } else if (propInitialSolution !== undefined) {
      setCurrentSolutionState(propInitialSolution)
    }
  }, [challengeData, propInitialSolution, isLoadingQuery])

  const mutation = useMutation({
    mutationFn: async (newSolution: string) => {
      const updatedChallenge = await updateChallengeOfficialSolution(slug, newSolution)
      return updatedChallenge
    },
    onMutate: async (newSolution: string) => {
      await queryClient.cancelQueries({ queryKey: ['challenge', slug] })

      const previousChallenge = queryClient.getQueryData(['challenge', slug])

      queryClient.setQueryData(['challenge', slug], (old: any) => {
        const currentSolutionObject = old?.officialSolution || {};
        return {
          ...(old || { slug: slug }),
          officialSolution: {
            ...currentSolutionObject,
            statement: newSolution,
          },
        };
      })

      return { previousChallenge }
    },
    onError: (err, newSolution, context) => {
      if (context?.previousChallenge) {
        queryClient.setQueryData(['challenge', slug], context.previousChallenge)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', slug] })
    },
  })

  return {
    solution: currentSolutionState,
    updateSolution: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
    isLoadingSolution: isLoadingQuery,
  }
}