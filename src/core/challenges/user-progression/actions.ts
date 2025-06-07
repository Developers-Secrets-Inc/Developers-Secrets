'use server'

import { getUser } from '@/core/user'
import {
  addLikeToChallenge,
  removeLikeFromChallenge,
  addDislikeToChallenge,
  removeDislikeFromChallenge,
  addRatingToChallenge,
  updateRatingForChallenge,
} from '@/core/challenges'
import {
  hasUserLikedChallenge,
  hasUserDislikedChallenge,
  getUserRating,
  setUserLike,
  setUserDislike,
  setUserRating,
  getUserIsSolutionUnlocked,
  getUserCompletionStatus,
  setUserCode,
  getSavedUserCode,
} from '@/core/challenges/user-progression'

/**
 * Toggles the like status for a challenge
 * @param liked The new like state (true to like, false to unlike)
 * @param challengeId The id of the challenge
 */
export async function toggleChallengeLike(liked: boolean, challengeId: number) {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id

    // Get current state
    const wasDisliked = await hasUserDislikedChallenge(userId, challengeId)

    // Prepare operations to run in parallel
    const dbOperations = []

    // If toggling to liked
    if (liked) {
      // If previously disliked, remove dislike
      if (wasDisliked) {
        dbOperations.push(removeDislikeFromChallenge(challengeId))
      }
      dbOperations.push(addLikeToChallenge(challengeId))
    } else {
      dbOperations.push(removeLikeFromChallenge(challengeId))
    }

    // Update user progression
    dbOperations.push(setUserLike(userId, challengeId, liked))

    // Execute all operations in parallel
    await Promise.all(dbOperations)

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Toggles the dislike status for a challenge
 * @param disliked The new dislike state (true to dislike, false to undislike)
 * @param challengeId The id of the challenge
 */
export async function toggleChallengeDislike(disliked: boolean, challengeId: number) {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id

    // Get current state
    const wasLiked = await hasUserLikedChallenge(userId, challengeId)

    // Prepare operations to run in parallel
    const dbOperations = []

    // If toggling to disliked
    if (disliked) {
      // If previously liked, remove like
      if (wasLiked) {
        dbOperations.push(removeLikeFromChallenge(challengeId))
      }
      dbOperations.push(addDislikeToChallenge(challengeId))
    } else {
      dbOperations.push(removeDislikeFromChallenge(challengeId))
    }

    // Update user progression
    dbOperations.push(setUserDislike(userId, challengeId, disliked))

    // Execute all operations in parallel
    await Promise.all(dbOperations)

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Rates a challenge with a score from 0 to 5
 * @param challengeSlug The slug of the challenge to rate
 * @param rating The rating value (0-5)
 * @returns Success status and error message if applicable
 */
export async function rateChallenge(challengeId: number, rating: number) {
  try {
    if (rating < 0 || rating > 5 || !Number.isInteger(rating)) {
      throw new Error('Invalid rating value. Must be an integer between 0 and 5')
    }

    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id

    // Get current rating
    const currentRating = await getUserRating(userId, challengeId)

    // Prepare operations
    const dbOperations = []

    if (currentRating) {
      // User has already rated, update the rating
      dbOperations.push(updateRatingForChallenge(challengeId, currentRating, rating))
    } else {
      // User hasn't rated yet, add a new rating
      dbOperations.push(addRatingToChallenge(challengeId, rating))
    }

    // Update user progression
    dbOperations.push(setUserRating(userId, challengeId, rating))

    // Execute all operations in parallel
    await Promise.all(dbOperations)

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}




export const isSolutionUnlocked = async (userId: string, challengeId: number) => {
  const solutionUnlocked = await getUserIsSolutionUnlocked(userId, challengeId)
  const challengeStatus = await getUserCompletionStatus(userId, challengeId)

  return solutionUnlocked || challengeStatus === 'completed'
}