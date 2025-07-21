import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSkillConceptsWithProgression,
  updateConceptProgression as updateConceptProgressionAction,
  completeSubConcepts,
} from '../index'
import { Concept } from '@/payload-types'

export type EnrichedConcept = Concept & {
  progression: number
  isLocked: boolean
  subConcepts: EnrichedConcept[]
}

export function normalizeEnrichedConcept(concept: any): EnrichedConcept {
  return {
    ...concept,
    isLocked: concept.isLocked, // Map isLocked
    subConcepts: Array.isArray(concept.subConcepts)
      ? concept.subConcepts
          .filter((sc: any): sc is EnrichedConcept => typeof sc === 'object' && sc !== null)
          .map(normalizeEnrichedConcept)
      : [],
  }
}

function updateConceptProgressionInTree(
  concepts: EnrichedConcept[],
  conceptId: number,
  newProgression: number,
): EnrichedConcept[] {
  return concepts.map((concept) => {
    if (concept.id === conceptId) {
      return { ...concept, progression: newProgression }
    }
    if (Array.isArray(concept.subConcepts) && concept.subConcepts.length > 0) {
      return {
        ...concept,
        subConcepts: updateConceptProgressionInTree(concept.subConcepts, conceptId, newProgression),
      }
    }
    return { ...concept }
  })
}

export function useConceptsProgression(
  skillSlug: string,
  userId: string,
  initialData?: EnrichedConcept[],
) {
  const queryClient = useQueryClient()

  const query = useQuery<EnrichedConcept[]>({
    queryKey: ['concepts-progression', skillSlug, userId],
    queryFn: async () => {
      const data = await getSkillConceptsWithProgression(userId, skillSlug)
      return data.map(normalizeEnrichedConcept)
    },
    enabled: !!skillSlug && !!userId,
    initialData: initialData ? initialData.map(normalizeEnrichedConcept) : undefined,
  })

  const mutation = useMutation({
    mutationFn: async ({
      conceptId,
      newProgression,
    }: {
      conceptId: number
      newProgression: number
    }) => {
      const result = await updateConceptProgressionAction(userId, conceptId, newProgression)
      if (result === 100) {
        const completedIds = await completeSubConcepts(userId, conceptId)
        // Update optimiste multi-noeuds dans le cache local
        const previousData = queryClient.getQueryData<EnrichedConcept[]>([
          'concepts-progression',
          skillSlug,
          userId,
        ])
        if (previousData) {
          let newData = previousData
          for (const id of completedIds) {
            newData = updateConceptProgressionInTree(newData, id, 100)
          }
          queryClient.setQueryData(['concepts-progression', skillSlug, userId], newData)
        }
        // Invalider le cache global pour garantir la fraîcheur
        queryClient.invalidateQueries({ queryKey: ['concepts-progression', skillSlug, userId] })
      }
    },
    onMutate: async ({ conceptId, newProgression }) => {
      await queryClient.cancelQueries({ queryKey: ['concepts-progression', skillSlug, userId] })
      const previousData = queryClient.getQueryData<EnrichedConcept[]>([
        'concepts-progression',
        skillSlug,
        userId,
      ])
      if (previousData) {
        const newData = updateConceptProgressionInTree(previousData, conceptId, newProgression)
        queryClient.setQueryData(['concepts-progression', skillSlug, userId], newData)
      }
      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['concepts-progression', skillSlug, userId], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts-progression', skillSlug, userId] })
    },
  })

  return {
    ...query,
    updateConceptProgression: mutation.mutateAsync,
    updateConceptProgressionStatus: mutation.status,
    updateConceptProgressionError: mutation.error,
  }
}
