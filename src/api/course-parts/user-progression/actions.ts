'use server'

import { getUser } from '@/core/user'
import {
  findUserCoursePartEngagement,
  createUserCoursePartEngagement,
  updateUserCoursePartEngagement,
  removeUserCoursePartEngagement,
} from '@/api/course-parts/engagement/engagement'
import {
  findCoursePartRating,
  upsertCoursePartRating,
  removeCoursePartRating,
} from '@/api/course-parts/engagement/rating'

/**
 * Toggles the like status for a course part
 * @param liked The new like state (true to like, false to unlike)
 * @param coursePartId The id of the course part
 */
export async function toggleCoursePartLike(liked: boolean, coursePartId: number) {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id

    // Get current engagement
    const currentEngagement = await findUserCoursePartEngagement({ userId, coursePartId })

    if (liked) {
      if (currentEngagement) {
        // Update existing engagement to like
        await updateUserCoursePartEngagement({
          engagementId: currentEngagement.id,
          type: 'like',
        })
      } else {
        // Create new like engagement
        await createUserCoursePartEngagement({
          userId,
          coursePartId,
          type: 'like',
        })
      }
    } else {
      // Remove like (unlike)
      if (currentEngagement && currentEngagement.type === 'like') {
        await removeUserCoursePartEngagement({
          engagementId: currentEngagement.id,
        })
      }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Toggles the dislike status for a course part
 * @param disliked The new dislike state (true to dislike, false to undislike)
 * @param coursePartId The id of the course part
 */
export async function toggleCoursePartDislike(disliked: boolean, coursePartId: number) {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id

    // Get current engagement
    const currentEngagement = await findUserCoursePartEngagement({ userId, coursePartId })

    if (disliked) {
      if (currentEngagement) {
        // Update existing engagement to dislike
        await updateUserCoursePartEngagement({
          engagementId: currentEngagement.id,
          type: 'dislike',
        })
      } else {
        // Create new dislike engagement
        await createUserCoursePartEngagement({
          userId,
          coursePartId,
          type: 'dislike',
        })
      }
    } else {
      // Remove dislike (undislike)
      if (currentEngagement && currentEngagement.type === 'dislike') {
        await removeUserCoursePartEngagement({
          engagementId: currentEngagement.id,
        })
      }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Rates a course part
 * @param coursePartId The id of the course part
 * @param rating The rating value (1-5)
 */
export async function rateCoursePartAction(coursePartId: number, rating: number) {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    // Upsert the rating
    await upsertCoursePartRating({
      userId,
      coursePartId,
      rating,
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Removes a rating for a course part
 * @param coursePartId The id of the course part
 */
export async function removeCoursePartRatingAction(coursePartId: number) {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      throw new Error('Authentication required')
    }

    const userId = user.id

    // Find existing rating
    const existingRating = await findCoursePartRating({ userId, coursePartId })

    if (existingRating) {
      await removeCoursePartRating({ ratingId: existingRating.id })
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Checks if user has liked a course part
 * @param userId The user id
 * @param coursePartId The course part id
 */
export async function hasUserLikedCoursePart(
  userId: string,
  coursePartId: number,
): Promise<boolean> {
  try {
    const engagement = await findUserCoursePartEngagement({ userId, coursePartId })
    return engagement?.type === 'like'
  } catch (error) {
    console.error('Error checking if user liked course part:', error)
    return false
  }
}

/**
 * Checks if user has disliked a course part
 * @param userId The user id
 * @param coursePartId The course part id
 */
export async function hasUserDislikedCoursePart(
  userId: string,
  coursePartId: number,
): Promise<boolean> {
  try {
    const engagement = await findUserCoursePartEngagement({ userId, coursePartId })
    return engagement?.type === 'dislike'
  } catch (error) {
    console.error('Error checking if user disliked course part:', error)
    return false
  }
}

/**
 * Gets user rating for a course part
 * @param userId The user id
 * @param coursePartId The course part id
 */
export async function getUserCoursePartRating(
  userId: string,
  coursePartId: number,
): Promise<number | null> {
  try {
    const rating = await findCoursePartRating({ userId, coursePartId })
    return rating ? parseInt(rating.rating) : null
  } catch (error) {
    console.error('Error getting user course part rating:', error)
    return null
  }
}
