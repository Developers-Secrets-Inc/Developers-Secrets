'use server'

import 'server-only'

import { Course } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getFirstChapter } from './chapters'
import { getFirstArticle } from './parts'
import { getCourseCompletedPartsCount, getUserChapterCompletionStatus } from './progression/completion-status'

// Define the augmented type
export type CourseWithStartUrl = Course & {
  startUrl?: string | null
  totalPartsCount?: number
  allPartIds?: number[]
}

// Define the interface for the progress summary
export interface CourseProgressSummary {
  courseName: string
  totalChapters: number
  completedChapters: number
  totalParts: number
  completedParts: number
  // Optional: Add course slug or ID if needed by the card for other purposes, though lastCourseSlug is already available client-side
  // courseSlug?: string;
}

export const getCourses = async (): Promise<Course[]> => {
  const payload = await getPayload({ config })

  const courses = await payload.find({
    collection: 'courses',
  })

  return courses.docs
}

export const getCourseById = async (id: number): Promise<Course> => {
  const payload = await getPayload({ config })

  const course = await payload.findByID({
    collection: 'courses',
    id,
  })

  if (!course) {
    throw new Error('Course not found')
  }

  return course
}

export const getCourseBySlug = async (slug: string): Promise<Course> => {
  const payload = await getPayload({ config })

  const course = await payload.find({
    collection: 'courses',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!course) {
    throw new Error('Course not found')
  }

  return course.docs[0]
}

export const getCoursesWithStartUrl = async (): Promise<CourseWithStartUrl[]> => {
  const courses = await getCourses() // Get all base courses
  const payload = await getPayload({ config }) // Get payload instance for fetching chapters if needed

  const coursesWithUrls = await Promise.all(
    courses.map(async (course) => {
      let startUrl: string | null = `/courses/${course.slug}` // Default URL
      let totalPartsCount = 0
      const allPartIds: number[] = [] // Initialize array for part IDs

      try {
        // Calculate total parts and collect all part IDs
        if (course.orderedChapters && course.orderedChapters.length > 0) {
          for (const chapRef of course.orderedChapters) {
            let chapterFull: Course['orderedChapters'][0] | null = null
            if (typeof chapRef === 'number') {
              try {
                // Fetch the full chapter object if it's an ID
                chapterFull = await payload.findByID({
                  collection: 'chapters',
                  id: chapRef,
                  depth: 1, // Depth 1 should be enough to get 'parts' array
                })
              } catch (e) {
                console.error(`Error fetching chapter ${chapRef} for course ${course.id}:`, e)
                chapterFull = null
              }
            } else {
              chapterFull = chapRef // It's already a populated object
            }

            if (chapterFull && typeof chapterFull === 'object' && chapterFull.parts) {
              totalPartsCount += chapterFull.parts.length
              // Collect part IDs
              chapterFull.parts.forEach((partRef) => {
                if (typeof partRef === 'number') {
                  allPartIds.push(partRef)
                } else if (typeof partRef === 'object' && partRef !== null && 'id' in partRef) {
                  // Assuming partRef here is CoursePart like object with an id
                  allPartIds.push(partRef.id as number) // Cast to number if id is string
                }
              })
            }
          }
        }

        const firstChapter = await getFirstChapter(course.id)
        if (firstChapter && typeof firstChapter === 'object' && firstChapter.slug) {
          // Now get the first part using the course ID
          const firstPart = await getFirstArticle(course.id)
          if (firstPart && typeof firstPart === 'object' && firstPart.slug) {
            startUrl = `/courses/${course.slug}/${firstChapter.slug}/${firstPart.slug}`
          }
        }
      } catch (error) {
        console.error(`Error processing course ${course.id}:`, error)
        // Keep the default course URL and potentially 0 parts if errors occur during part calculation
      }

      return {
        ...course,
        startUrl,
        totalPartsCount,
        allPartIds,
      }
    }),
  )

  return coursesWithUrls
}

/**
 * Fetches a summary of the user's progress for a specific course.
 * @param userId The ID of the user.
 * @param courseSlug The slug of the course.
 * @returns A CourseProgressSummary object or null if the course is not found or an error occurs.
 */
export async function getCourseProgressSummary(
  userId: string,
  courseSlug: string,
): Promise<CourseProgressSummary | null> {
  if (!userId || !courseSlug) {
    console.warn('[getCourseProgressSummary] userId or courseSlug missing')
    return null
  }

  const payload = await getPayload({ config })

  try {
    // 1. Fetch the course with enough depth to get chapters and their parts list
    const courseResult = await payload.find({
      collection: 'courses',
      where: { slug: { equals: courseSlug } },
      limit: 1,
      depth: 2, // Course -> Chapters (populated) -> Parts (IDs or populated enough for IDs)
    })

    if (!courseResult.docs[0]) {
      console.warn(`[getCourseProgressSummary] Course with slug "${courseSlug}" not found.`)
      return null
    }
    const course: Course = courseResult.docs[0]

    const courseName = course.name
    let totalChapters = 0
    let completedChapters = 0
    let totalParts = 0
    const allPartIds: number[] = []

    if (course.orderedChapters && course.orderedChapters.length > 0) {
      totalChapters = course.orderedChapters.length

      for (const chapRef of course.orderedChapters) {
        let chapterFull: Course['orderedChapters'][0] | null = null
        // Check if chapRef is a number (ID) or a populated Chapter object
        if (typeof chapRef === 'number') {
          try {
            chapterFull = await payload.findByID({
              collection: 'chapters',
              id: chapRef,
              depth: 1, // Depth 1 to get parts array
            })
          } catch (e) {
            console.error(
              `[getCourseProgressSummary] Error fetching chapter ${chapRef} for course ${course.id}:`,
              e,
            )
            // Continue to next chapter if one fails to load, or handle error differently
            continue
          }
        } else if (typeof chapRef === 'object' && chapRef !== null && 'id' in chapRef) {
          // It's already a populated object (due to depth: 2 on course query)
          chapterFull = chapRef as Course['orderedChapters'][0]
        }

        if (chapterFull) {
          // Count completed chapters
          const chapterStatus = await getUserChapterCompletionStatus(userId, chapterFull.id)
          if (chapterStatus === 'completed') {
            completedChapters++
          }

          // Aggregate parts from this chapter
          if (chapterFull.parts && chapterFull.parts.length > 0) {
            for (const partRef of chapterFull.parts) {
              if (typeof partRef === 'number') {
                allPartIds.push(partRef)
              } else if (typeof partRef === 'object' && partRef !== null && 'id' in partRef) {
                // Ensure partRef.id is a number if your type expects number IDs
                allPartIds.push(Number(partRef.id))
              }
            }
            totalParts += chapterFull.parts.length
          }
        }
      }
    }

    let completedParts = 0
    if (allPartIds.length > 0) {
      completedParts = await getCourseCompletedPartsCount(userId, allPartIds)
    }

    return {
      courseName,
      totalChapters,
      completedChapters,
      totalParts,
      completedParts,
    }
  } catch (error) {
    console.error(
      `[getCourseProgressSummary] Error fetching progress for user ${userId}, course ${courseSlug}:`,
      error,
    )
    return null
  }
}
