'use server'

import { getCompletionStatus } from '@/core/challenges/user-progression/completion-status'
import 'server-only'
import { categories } from './types'




export const getChallengeCategoryProgression = async (
  userId: string,
  categorySlug: string,
): Promise<number> => {
  const category = await categories.getUnique.bySlugWithChallenges(categorySlug)
  
  const challengesIds =
    category?.parts?.flatMap((part) =>
      part.challenges.map((challenge) =>
        typeof challenge === 'number' ? challenge : challenge.id,
      ),
    ) ?? []

  const progressions = Promise.all(
    challengesIds.map(async (challengeId) => await getCompletionStatus(userId, challengeId)),
  )

  const completedChallengesCount = (await progressions).filter(
    (progression) => progression === 'completed',
  ).length

  return Math.round((completedChallengesCount / challengesIds.length) * 100)
}






