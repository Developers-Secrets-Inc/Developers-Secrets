import { useQuery } from '@tanstack/react-query'
import { getConceptsForSkill } from '@/core/skills/actions'

export const usePythonConcepts = () => {
  return useQuery({
    queryKey: ['python-concepts'],
    queryFn: () => getConceptsForSkill('python'),
    staleTime: 1000 * 60 * 10, // 10 min cache
  })
}
