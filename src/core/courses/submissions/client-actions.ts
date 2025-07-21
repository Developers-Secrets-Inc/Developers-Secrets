'use client'

import { CoursePartSubmission } from '@/payload-types'
import {
  createCoursePartSubmission as serverCreateCoursePartSubmission,
  getCoursePartSubmissions as serverGetCoursePartSubmissions,
} from './actions'

// Type for creation data expected by the client wrapper
type CreateSubmissionData = Omit<CoursePartSubmission, 'id' | 'createdAt' | 'updatedAt'> & {
  part: number // Assuming client always passes part ID
}

/**
 * Client-side function to create a course part submission.
 * Calls the corresponding server action.
 */
export async function createCoursePartSubmission(
  submissionData: CreateSubmissionData,
): Promise<{ success: boolean; data?: CoursePartSubmission; error?: string }> {
  try {
    // Pass data directly to the server action
    return await serverCreateCoursePartSubmission(submissionData)
  } catch (error) {
    console.error('Error in client createCoursePartSubmission:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create submission',
    }
  }
}

/**
 * Client-side function to fetch course part submissions.
 * Calls the corresponding server action.
 * Note: Usually data fetching is handled via hooks (useQuery).
 */
export async function getCoursePartSubmissions(
  partId: number,
  userId: string,
): Promise<CoursePartSubmission[]> {
  try {
    return await serverGetCoursePartSubmissions(partId, userId)
  } catch (error) {
    console.error('Error in client getCoursePartSubmissions:', error)
    // Return empty array or re-throw based on desired client error handling
    return []
  }
}
