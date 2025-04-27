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

  const coursesWithUrls = await Promise.all(
    courses.map(async (course) => {
      let startUrl: string | null = `/courses/${course.slug}` // Default URL

      try {
        const firstChapter = await getFirstChapter(course.id)
        if (firstChapter && typeof firstChapter === 'object' && firstChapter.slug) {
          // Now get the first part using the course ID
          const firstPart = await getFirstArticle(course.id)
          if (firstPart && typeof firstPart === 'object' && firstPart.slug) {
            startUrl = `/courses/${course.slug}/${firstChapter.slug}/${firstPart.slug}`
          }
        }
      } catch (error) {
        console.error(`Error fetching start URL for course ${course.id}:`, error)
        // Keep the default course URL if errors occur
      }

      return {
        ...course,
        startUrl,
      }
    }),
  )

  return coursesWithUrls
}
