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
  getUserChallengeProgression,
  updateUserChallengeProgression,
} from '@/core/user-progression'

/**
 * Toggles the like status for a challenge
 * @param liked The new like state (true to like, false to unlike)
 * @param challengeSlug The slug of the challenge
 */
export async function toggleChallengeLike(liked: boolean, challengeSlug: string) {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id

    // Get current user progression
    const progression = await getUserChallengeProgression(userId, challengeSlug)

    // Prepare operations to run in parallel
    const dbOperations = []

    // If toggling to liked
    if (liked) {
      // If previously disliked, remove dislike
      if (progression?.hasDisliked) {
        dbOperations.push(removeDislikeFromChallenge(challengeSlug))
      }

      dbOperations.push(addLikeToChallenge(challengeSlug))

      // Always create/update user progression
      dbOperations.push(
        updateUserChallengeProgression(userId, challengeSlug, {
          hasLiked: true,
          hasDisliked: false,
        }),
      )
    }
    // If toggling to unliked
    else {
      dbOperations.push(removeLikeFromChallenge(challengeSlug))

      // Always create/update user progression
      dbOperations.push(
        updateUserChallengeProgression(userId, challengeSlug, {
          hasLiked: false,
        }),
      )
    }

    // Execute all operations in parallel
    const results = await Promise.all(dbOperations)

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Toggles the dislike status for a challenge
 * @param disliked The new dislike state (true to dislike, false to undislike)
 * @param challengeSlug The slug of the challenge
 */
export async function toggleChallengeDislike(disliked: boolean, challengeSlug: string) {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id
    console.log(
      `[ACTION] toggleChallengeDislike - User: ${userId}, Challenge: ${challengeSlug}, Dislike: ${disliked}`,
    )

    // Get current user progression
    const progression = await getUserChallengeProgression(userId, challengeSlug)
    console.log(
      `[ACTION] Current progression: ${progression ? 'Found' : 'Not found'}`,
      progression ? `(Liked: ${progression.hasLiked}, Disliked: ${progression.hasDisliked})` : '',
    )

    // Prepare operations to run in parallel
    const dbOperations = []

    // If toggling to disliked
    if (disliked) {
      // If previously liked, remove like
      if (progression?.hasLiked) {
        console.log(`[ACTION] Removing previous like for challenge: ${challengeSlug}`)
        dbOperations.push(removeLikeFromChallenge(challengeSlug))
      }

      console.log(`[ACTION] Adding dislike to challenge: ${challengeSlug}`)
      dbOperations.push(addDislikeToChallenge(challengeSlug))

      // Always create/update user progression
      console.log(`[ACTION] Updating user progression: hasDisliked=true, hasLiked=false`)
      dbOperations.push(
        updateUserChallengeProgression(userId, challengeSlug, {
          hasDisliked: true,
          hasLiked: false,
        }),
      )
    }
    // If toggling to undisliked
    else {
      console.log(`[ACTION] Removing dislike from challenge: ${challengeSlug}`)
      dbOperations.push(removeDislikeFromChallenge(challengeSlug))

      // Always create/update user progression
      console.log(`[ACTION] Updating user progression: hasDisliked=false`)
      dbOperations.push(
        updateUserChallengeProgression(userId, challengeSlug, {
          hasDisliked: false,
        }),
      )
    }

    // Execute all operations in parallel
    const results = await Promise.all(dbOperations)
    console.log(`[ACTION] All operations completed successfully:`, results.length)

    return { success: true }
  } catch (error) {
    console.error('[ACTION] Error toggling dislike:', error)
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Rates a challenge with a score from 0 to 5
 * @param challengeSlug The slug of the challenge to rate
 * @param rating The rating value (0-5)
 * @returns Success status and error message if applicable
 */
export async function rateChallenge(challengeSlug: string, rating: number) {
  try {
    console.log(`[ACTION] rateChallenge - Challenge: ${challengeSlug}, Rating: ${rating}`)

    // Validate rating value
    if (rating < 0 || rating > 5 || !Number.isInteger(rating)) {
      throw new Error('Invalid rating value. Must be an integer between 0 and 5')
    }

    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id
    console.log(`[ACTION] Rating challenge by user: ${userId}`)

    // Get current user progression
    const progression = await getUserChallengeProgression(userId, challengeSlug)
    const currentRating = progression?.rating || 0

    console.log(
      `[ACTION] Current progression: ${progression ? 'Found' : 'Not found'}`,
      progression ? `(Current rating: ${currentRating})` : '',
    )

    // Prepare operations
    const dbOperations = []

    if (progression && currentRating > 0) {
      // User has already rated, update the rating
      console.log(`[ACTION] Updating existing rating from ${currentRating} to ${rating}`)
      dbOperations.push(updateRatingForChallenge(challengeSlug, currentRating, rating))
    } else {
      // User hasn't rated yet, add a new rating
      console.log(`[ACTION] Adding new rating: ${rating}`)
      dbOperations.push(addRatingToChallenge(challengeSlug, rating))
    }

    // Always update user progression
    console.log(`[ACTION] Updating user progression with rating: ${rating}`)
    dbOperations.push(
      updateUserChallengeProgression(userId, challengeSlug, {
        rating,
      }),
    )

    // Execute all operations in parallel
    const results = await Promise.all(dbOperations)
    console.log(`[ACTION] All rating operations completed successfully:`, results.length)

    return { success: true }
  } catch (error) {
    console.error('[ACTION] Error rating challenge:', error)
    return { success: false, error: (error as Error).message }
  }
}
