import { getSkillConcepts } from '@/api/skills'
import { useQuery } from '@tanstack/react-query'

export const usePythonConcepts = () => {
  return useQuery({
    queryKey: ['python-concepts'],
    queryFn: () => getSkillConcepts('python'),
    staleTime: 1000 * 60 * 10, // 10 min cache
  })
}
