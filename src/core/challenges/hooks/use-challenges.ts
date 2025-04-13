import { useQuery } from '@tanstack/react-query'
import { getAllChallenges } from '..'
import { getUser } from '@/core/user'
import { getUserCompletionStatus } from '../user-progression'

export const useChallenges = () => {
  // Query pour récupérer l'utilisateur
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })

  // Query pour récupérer les challenges
  const { data: challenges, isLoading: isChallengesLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: getAllChallenges,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Query pour récupérer les statuts des challenges
  const { data: challengesWithProgress, isLoading } = useQuery({
    queryKey: ['challenges-progress', user?.id],
    queryFn: async () => {
      if (!user?.id || !challenges) return []

      return Promise.all(
        challenges.map(async (challenge) => {
          const status = await getUserCompletionStatus(user.id, challenge.id as number)
          return {
            id: challenge.id as number,
            title: challenge.title,
            difficulty: challenge.difficulty as 'easy' | 'medium' | 'hard' | 'horrible',
            baseExperience: challenge.baseExperience || 0,
            slug: challenge.slug,
            status,
          }
        }),
      )
    },
    enabled: !!user?.id && !!challenges,
  })

  return {
    challenges: challengesWithProgress,
    isLoading: isLoading || isChallengesLoading,
  }
}
