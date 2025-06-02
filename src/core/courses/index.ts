'use server'

import 'server-only'

import { Chapter, Course, CoursePart } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getChapterById, getFirstChapter } from './chapters'
import { getFirstArticle, getPartById } from './parts'
import {
  getCourseCompletedPartsCount,
  getUserChapterCompletionStatus,
} from './progression/completion-status'

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


export type CompletionStatus = 'not_started' | 'in_progress' | 'completed'


export type CourseOutline = {
  chapterId: number
  chapterSlug: string
  chapterName: string
  parts: { id: number; name: string; slug: string }[]
  requiredChapters?: (number | Chapter)[]
  status: CompletionStatus
}[]


export const getCourseOutline = async (courseSlug: string): Promise<CourseOutline> => {
  const course = await getCourseBySlug(courseSlug)

  const courseOutlineStatic: CourseOutline = await Promise.all(
    (course.orderedChapters || []).map(async (chapRef: number | Chapter) => {
      const chapter = typeof chapRef === 'number' ? await getChapterById(chapRef) : chapRef
      if (!chapter) return null

      const resolvedParts = await Promise.all(
        (chapter.parts || []).map(async (partRef) => {
          const part =
            typeof partRef === 'number' ? await getPartById(partRef) : (partRef as CoursePart)
          return part ? { id: part.id, name: part.name, slug: part.slug } : null
        }),
      ).then((parts) =>
        parts.filter((p): p is { id: number; name: string; slug: string } => p !== null),
      )

      return {
        chapterId: chapter.id,
        chapterSlug: chapter.slug,
        chapterName: chapter.name,
        parts: resolvedParts,
        requiredChapters: chapter.requiredChapters || [],
        status: 'not_started' as CompletionStatus,
      }
    }),
  ).then((chapters) => chapters.filter((c): c is Exclude<typeof c, null> => c !== null))

  return courseOutlineStatic
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
            let chapterFull: Chapter | null = null
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
              chapterFull.parts.forEach((partRef: number | CoursePart) => {
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
        let chapterFull: Chapter | null = null
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
          chapterFull = chapRef as Chapter
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

import { unstable_cache } from 'next/cache'

const ONE_HOUR = 60 * 60

export const getRecommendedCourses = unstable_cache(
  async (): Promise<CourseWithStartUrl[]> => {
    const courses = await getCoursesWithStartUrl()
    // Mélanger et prendre 3 cours aléatoires
    const shuffled = [...courses].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  },
  ['recommended-courses'],
  {
    revalidate: ONE_HOUR, // 1 heure
    tags: ['courses'],
  },
)

export const getCoursesStaticInformation = async (): Promise<{
  courses: string[]
  chapters: string[]
  parts: string[]
}> => {
  const payload = await getPayload({ config })

  // Fetch courses with depth 2 to populate orderedChapters and their parts
  const coursesResult = await payload.find({
    collection: 'courses',
    depth: 2, // Depth 1 populates chapters, Depth 2 populates parts within chapters
  })

  const courses = coursesResult.docs

  const params: { course_slug: string; chapter_slug: string; part_slug: string }[] = []

  for (const course of courses) {
    // Ensure orderedChapters is an array and contains populated chapter objects
    if (Array.isArray(course.orderedChapters)) {
      for (const chapterRef of course.orderedChapters) {
        // Check if chapterRef is a populated object and has a slug
        if (typeof chapterRef === 'object' && chapterRef !== null && 'slug' in chapterRef) {
          const chapter = chapterRef as Chapter // Cast to Chapter type

          // Ensure parts is an array and contains populated part objects
          if (Array.isArray(chapter.parts)) {
            for (const partRef of chapter.parts) {
              // Check if partRef is a populated object and has a slug
              if (typeof partRef === 'object' && partRef !== null && 'slug' in partRef) {
                const part = partRef as CoursePart // Cast to CoursePart type

                params.push({
                  course_slug: course.slug,
                  chapter_slug: chapter.slug,
                  part_slug: part.slug,
                })
              }
            }
          }
        }
      }
    }
  }

  return params
}

export const getCoursePartsIds = unstable_cache(
  async (courseId: number): Promise<number[]> => {
    const course = await getCourseById(courseId)
    const courseChapters =
      course.orderedChapters?.map((chapter) => {
        if (typeof chapter === 'number') {
          return chapter
        } else {
          return chapter.id
        }
      }) || []

    const coursePartsPromises = courseChapters.map(async (chapterId) => {
      const chapter = await getChapterById(chapterId)
      return (
        chapter.parts?.map((part) => {
          if (typeof part === 'number') {
            return part
          } else {
            return part.id
          }
        }) || []
      )
    })

    const courseParts = await Promise.all(coursePartsPromises)
    return courseParts.flat()
  },
  ['course-parts'],
  {
    revalidate: ONE_HOUR, // 1 heure
    tags: ['courses'],
  },
)
