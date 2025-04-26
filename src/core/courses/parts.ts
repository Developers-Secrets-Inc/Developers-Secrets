'use server'

import 'server-only'
import { getCourseById, getCourseBySlug } from '.'
import { CoursePart } from '@/payload-types'
import { getChapterBySlug, getFirstChapter } from './chapters'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getPartById = async (partId: number): Promise<CoursePart> => {
  const payload = await getPayload({ config })

  const part = await payload.findByID({
    collection: 'courseParts',
    id: partId,
  })

  if (!part) {
    throw new Error(`Part with ID ${partId} not found`)
  }

  return part
}

export const getFirstArticle = async (courseId: number): Promise<CoursePart | null> => {
  const firstChapter = await getFirstChapter(courseId)

  if (!firstChapter || !firstChapter.parts) {
    return null
  }

  const firstArticle = firstChapter.parts[0]

  if (!firstArticle) {
    return null
  }

  if (typeof firstArticle === 'number') {
    return getPartById(firstArticle)
  }

  return firstArticle
}

export const getPartBySlug = async (
  courseSlug: string,
  chapterSlug: string,
  partSlug: string,
): Promise<CoursePart> => {
  const chapter = await getChapterBySlug(courseSlug, chapterSlug)

  if (!chapter || !chapter.parts) {
    throw new Error(`Chapter "${chapterSlug}" in course "${courseSlug}" not found or has no parts.`)
  }

  let foundPart: CoursePart | undefined | null = null
  for (const partRef of chapter.parts) {
    if (typeof partRef === 'number') {
      const partById = await getPartById(partRef)
      if (partById?.slug === partSlug) {
        foundPart = partById
        break
      }
    } else if (typeof partRef === 'object' && partRef !== null && 'slug' in partRef) {
      if (partRef.slug === partSlug) {
        foundPart = partRef
        break
      }
    }
  }

  if (!foundPart) {
    throw new Error(
      `Part with slug "${partSlug}" not found in chapter "${chapterSlug}" of course "${courseSlug}"`,
    )
  }

  return foundPart
}
