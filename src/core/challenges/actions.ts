'use server'

import { Challenge } from '@/payload-types'
import {
  getUserIsSolutionUnlocked,
  setUserCompletionStatus,
  getUserCompletionStatus,
} from './user-progression'
import { revalidatePath } from 'next/cache'
import { addExperience } from '../gamification/level'
import { handleChallengeCompletionForQuests } from '../gamification/quests/actions'
import { trackAchievementProgress } from '@/core/gamification/achievements/action'
import { recordChallengeCompletion } from '../skills/progression'

/**
 * Handles all the logic when a challenge is completed by a user.
 * This function is called when a user successfully submits a solution that passes all tests.
 * It's designed to be modular and will handle all completion-related actions.
 */
export const handleChallengeCompletion = async (
  challenge: Challenge,
  userId: string,
  skillSlug: string,
) => {
  try {
    // Check if the challenge is already completed
    const completionStatus = await getUserCompletionStatus(userId, challenge.id)
    const isSolutionUnlocked = await getUserIsSolutionUnlocked(userId, challenge.id)

    // Only give experience if the challenge hasn't been completed before
    if (completionStatus !== 'completed' && !isSolutionUnlocked) {
      await addExperience(userId, challenge.baseExperience ?? 50)
    }

    await setUserCompletionStatus(userId, challenge.id, 'completed')

    // Update quest progression for challenge completion quests
    await handleChallengeCompletionForQuests(userId)

    await trackAchievementProgress(userId, 'challenges_completed', 1)

    await recordChallengeCompletion(userId, challenge.id, skillSlug)

    revalidatePath(`/challenges/${challenge.slug}`)

    // TODO: Future implementations
    // - Track statistics
    // - Unlock achievements
    // etc.
  } catch (error) {
    console.error('Error handling challenge completion:', error)
    throw error
  }
}
