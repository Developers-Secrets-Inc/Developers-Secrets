import { useQuery } from '@tanstack/react-query'
import {
  // Import the action that fetches ALL challenges with progress
  // getUserChallengeProgressions, // Import the action to fetch all progressions for a user
  getAllUserCompletionStatuses,
} from '../user-progression/completion-status'
import { getAllChallenges, getChallengeTableInformations } from '../challenge-queries'
import { useUser } from '@/core/users/hooks/use-user'
import { ChallengeWithProgress } from '@/core/challenges' // Keep this type
import { UserChallengeProgression } from '@/payload-types' // Import the progression type
import { CompletionStatus } from '../user-progression/types'

export const useChallenges = () => {
  // Use client-side user
  const { user } = useUser()

  // Query to fetch ALL challenges (ensure getAllChallenges has pagination: false)
  const { data: challenges, isLoading: isChallengesLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallengeTableInformations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Query to fetch ALL user challenge progressions for the current user
  const { data: userProgressions, isLoading: isProgressionsLoading } = useQuery<
    UserChallengeProgression[],
    Error
  >({
    queryKey: ['user-challenge-progressions', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      // Assuming getUserChallengeProgressions fetches all progressions for the user
      return getAllUserCompletionStatuses(user.id)
    },
    enabled: !!user?.id, // Enable only when user is available
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Combine challenges and their progress status
  const { data: challengesWithProgress, isLoading: isCombiningLoading } = useQuery<
    ChallengeWithProgress[],
    Error
  >({
    // Depend on challenges and user progressions
    queryKey: [
      'challenges-with-progress',
      user?.id,
      challenges?.map((c: { id: any }) => c.id).join('-'),
      userProgressions?.map((p: { id: any }) => p.id).join('-'),
    ],
    queryFn: () => {
      if (!challenges || !userProgressions) {
        return []
      }

      // Create a map for quick lookup of progression status
      const progressionMap = new Map<number, CompletionStatus>()
      userProgressions.forEach((prog: UserChallengeProgression) => {
        const challengeId = typeof prog.challenge === 'number' ? prog.challenge : prog.challenge?.id
        if (challengeId && prog.completionStatus) {
          progressionMap.set(challengeId, prog.completionStatus)
        }
      })

      // Map challenges and add status from the map
      return challenges.map(
        (
          challenge: Partial<{
            id: any
            title: any
            difficulty: any
            baseExperience: any
            slug: any
            draft?: boolean | null
          }>,
        ) => {
          const status = progressionMap.get(challenge.id as number) ?? 'not_started'
          return {
            id: challenge.id as number,
            title: challenge.title,
            difficulty: challenge.difficulty as ChallengeWithProgress['difficulty'],
            baseExperience: challenge.baseExperience ?? 50,
            slug: challenge.slug,
            status,
            draft: !!challenge.draft, // Force à false si null/undefined
          }
        },
      )
    },
    // Enable only when challenges and progressions are available
    enabled: !!challenges && !!userProgressions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    // Return the combined data
    challenges: challengesWithProgress ?? [], // Use the combined array
    // Combine loading states
    isLoading:
      isChallengesLoading || isProgressionsLoading || isCombiningLoading || !challengesWithProgress,
    // Explicitly return isFetching or other states if needed by UI
    // totalChallenges: challengesWithProgress?.length ?? 0, // Not needed for client-side pagination
    // pageCount: undefined, // Not needed
  }
}
