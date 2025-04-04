import { setUserCompletionStatus } from './user-progression'

/**
 * Handles all the logic when a challenge is completed by a user.
 * This function is called when a user successfully submits a solution that passes all tests.
 * It's designed to be modular and will handle all completion-related actions.
 */
export const handleChallengeCompletion = async (challengeId: number, userId: string) => {
  try {
    // Mark the challenge as completed
    await setUserCompletionStatus(userId, challengeId, 'completed')

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
