'use server'

import { Challenge } from '@/payload-types'
import { getUserIsSolutionUnlocked, setUserCompletionStatus } from './user-progression'
import { revalidatePath } from 'next/cache'
import { addExperience } from '../gamification/level'

/**
 * Handles all the logic when a challenge is completed by a user.
 * This function is called when a user successfully submits a solution that passes all tests.
 * It's designed to be modular and will handle all completion-related actions.
 */
export const handleChallengeCompletion = async (challenge: Challenge, userId: string) => {
  try {
    // Mark the challenge as completed
    if (!await getUserIsSolutionUnlocked(userId, challenge.id)) {
      await addExperience(userId, challenge.baseExperience ?? 50)
    }

    await setUserCompletionStatus(userId, challenge.id, 'completed')
    revalidatePath(`/challenges/${challenge.id}`)
    // TODO: Future implementations
    // - Add experience points
    // - Update user skills 
    // - Track statistics
    // - Unlock achievements
    // etc.
  } catch (error) {
    console.error('Error handling challenge completion:', error)
    throw error
  }
}
