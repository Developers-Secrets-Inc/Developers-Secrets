import { useQuery } from '@tanstack/react-query'
import {
  // Import the action that fetches ALL challenges with progress
  // We need a modified version or a new action for this
  // Let's assume we create/modify getChallengesWithProgress to accept NO args
  // and return all challenges. For now, let's simulate this.
  // We'll revert to the original logic pattern for simplicity here:
  getAllChallenges, // Assuming this fetches all challenges (needs pagination: false)
} from '..'
import { getUser } from '@/core/user'
import { getUserCompletionStatus } from '../user-progression' // Need this again
import { ChallengeWithProgress } from '@/core/challenges' // Keep this type

// Remove UseChallengesParams interface and defaultParams

export const useChallenges = () => {
  // Re-introduce the query for the user object
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  // Query to fetch ALL challenges (ensure getAllChallenges has pagination: false)
  const { data: challenges, isLoading: isChallengesLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: getAllChallenges, // Use the function that gets all challenges
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Query to get progress status for ALL fetched challenges
  const { data: challengesWithProgress, isLoading: isProgressLoading } = useQuery<
    ChallengeWithProgress[],
    Error
  >({
    queryKey: ['challenges-progress', user?.id, challenges?.map((c) => c.id).join('-')],
    queryFn: async () => {
      // If no user or no challenges fetched yet, return empty array
      if (!user?.id || !challenges || challenges.length === 0) {
        return []
      }
      // Fetch status for each challenge (original N+1 pattern, acceptable if client-side filtering is prioritized)
      return Promise.all(
        challenges.map(async (challenge) => {
          const status = await getUserCompletionStatus(user.id, challenge.id as number)
          return {
            id: challenge.id as number,
            title: challenge.title,
            difficulty: challenge.difficulty as ChallengeWithProgress['difficulty'],
            baseExperience: challenge.baseExperience ?? 50,
            slug: challenge.slug,
            status,
          }
        }),
      )
    },
    // Enable only when user and challenges are available
    enabled: !!user?.id && !!challenges && challenges.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    // Return the combined data
    challenges: challengesWithProgress ?? [], // Use the array with progress status
    // Combine loading states
    isLoading: isChallengesLoading || isProgressLoading || !challengesWithProgress,
    // Explicitly return isFetching or other states if needed by UI
    // totalChallenges: challengesWithProgress?.length ?? 0, // Not needed for client-side pagination
    // pageCount: undefined, // Not needed
  }
}
