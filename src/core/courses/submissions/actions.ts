'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { CoursePartSubmission } from '@/payload-types' // Assuming this will be generated

// Type definition for the data expected when creating a submission
// This should align with the fields in the CoursePartSubmissions collection
// Excluding fields automatically handled like id, createdAt, updatedAt
type CreateSubmissionData = Omit<
  CoursePartSubmission,
  'id' | 'createdAt' | 'updatedAt' | 'part'
> & {
  // Allow part to be number (ID) or the object with an ID
  part: number | { id: number } // Adjust { id: number } if your CoursePart type uses string ID
}

/**
 * Creates a new course part submission record in the database.
 * @param submissionData Data for the new submission.
 * @returns Object indicating success or failure, including the created document or error message.
 */
export async function createCoursePartSubmission(
  submissionData: CreateSubmissionData,
): Promise<{ success: boolean; data?: CoursePartSubmission; error?: string }> {
  const payload = await getPayload({ config })

  try {
    // TODO: Add validation for submissionData if needed

    const result = await payload.create({
      collection: 'coursePartSubmissions',
      data: {
        ...submissionData,
        // Ensure relationship fields are handled correctly (pass ID)
        part:
          typeof submissionData.part === 'number' ? submissionData.part : submissionData.part.id,
      },
    })

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error saving course part submission:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save course part submission',
    }
  }
}

/**
 * Fetches the submission history for a specific user and course part.
 * @param partId The ID of the course part.
 * @param userId The ID of the user.
 * @returns Array of submission documents.
 */
export async function getCoursePartSubmissions(
  partId: number,
  userId: string,
): Promise<CoursePartSubmission[]> {
  const payload = await getPayload({ config })

  try {
    const submissions = await payload.find({
      collection: 'coursePartSubmissions',
      where: {
        part: { equals: partId },
        authorId: { equals: userId },
      },
      // Optional: Add sorting, default sort is likely by createdAt descending
      sort: '-createdAt',
      limit: 50, // Add a reasonable limit
    })

    return submissions.docs
  } catch (error) {
    console.error(`Error fetching submissions for part ${partId}, user ${userId}:`, error)
    return [] // Return empty array on error
  }
}
