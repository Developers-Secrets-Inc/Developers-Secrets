'use server'

import 'server-only'

import { Course } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getFirstChapter } from './chapters'
import { getFirstArticle } from './parts'

// Define the augmented type
export type CourseWithStartUrl = Course & {
  startUrl?: string | null
  totalPartsCount?: number
  allPartIds?: number[]
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
