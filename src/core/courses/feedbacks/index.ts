'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { CoursePartFeedback, User } from '@/payload-types'

// Define the type for the data expected by the action
type SubmitFeedbackData = {
  partId: number
  feedbackType: CoursePartFeedback['feedbackType'] // Use type from generated types
  details: string
  userId: string // Changed to required string ID
}

/**
 * Saves user feedback for a specific course part to the database.
 * @param data The feedback data.
 * @returns Object indicating success or failure, including an error message if applicable.
 */
export async function submitCoursePartFeedback(
  data: SubmitFeedbackData,
): Promise<{ success: boolean; error?: string }> {
  const payload = await getPayload({ config })

  try {
    // Basic validation (more specific validation could be added)
    if (!data.partId || !data.feedbackType || !data.details || !data.userId) {
      throw new Error('Missing required feedback data (partId, feedbackType, details, userId).')
    }

    await payload.create({
      collection: 'coursePartFeedback',
      data: {
        part: data.partId,
        feedbackType: data.feedbackType,
        details: data.details,
        userId: data.userId, // Pass required userId
        status: 'new', // Default status
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting course part feedback:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit feedback',
    }
  }
}
