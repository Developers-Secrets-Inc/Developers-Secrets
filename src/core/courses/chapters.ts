'use server'

import 'server-only'

import { getCourseById, getCourseBySlug } from '.'
import { Chapter } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getChapterById = async (chapterId: number): Promise<Chapter> => {
  const payload = await getPayload({ config })

  const chapter = await payload.findByID({
    collection: 'chapters',
    id: chapterId,
  })

  if (!chapter) {
    throw new Error('Chapter not found')
  }

  return chapter
}

export const getFirstChapter = async (courseId: number): Promise<Chapter | null> => {
  const course = await getCourseById(courseId)

  if (!course.orderedChapters) {
    return null
  }

  if (typeof course.orderedChapters[0] === 'number') {
    return getChapterById(course.orderedChapters[0])
  }

  return course.orderedChapters[0]
}

export const getChapterBySlug = async (
  courseSlug: string,
  chapterSlug: string,
): Promise<Chapter> => {
  const course = await getCourseBySlug(courseSlug)
  if (!course || !course.orderedChapters) {
    throw new Error(`Course with slug "${courseSlug}" not found or has no chapters.`)
  }

  // Find the chapter, handling both IDs and objects
  let foundChapter: Chapter | undefined | null = null
  for (const chapRef of course.orderedChapters) {
    if (typeof chapRef === 'number') {
      // If it's an ID, fetch the chapter and check its slug
      const chapterById = await getChapterById(chapRef)
      if (chapterById?.slug === chapterSlug) {
        foundChapter = chapterById
        break
      }
    } else if (typeof chapRef === 'object' && chapRef !== null && 'slug' in chapRef) {
      // If it's an object, check its slug directly
      if (chapRef.slug === chapterSlug) {
        foundChapter = chapRef
        break
      }
    }
  }

  if (!foundChapter) {
    throw new Error(`Chapter with slug "${chapterSlug}" not found in course "${courseSlug}"`)
  }

  return foundChapter
}
