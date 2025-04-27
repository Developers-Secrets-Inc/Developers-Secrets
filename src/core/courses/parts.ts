'use server'

import 'server-only'
import { getCourseById, getCourseBySlug } from '.'
import { Chapter, CoursePart } from '@/payload-types'
import { getChapterBySlug, getFirstChapter, getChapterById } from './chapters'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getPartById = async (partId: number): Promise<CoursePart> => {
  const payload = await getPayload({ config })

  const part = await payload.findByID({
    collection: 'courseParts',
    id: partId,
    depth: 3,
  })

  if (!part) {
    throw new Error(`Part with ID ${partId} not found`)
  }

  return part
}

export const getFirstArticle = async (courseId: number): Promise<CoursePart | null> => {
  const firstChapter = await getFirstChapter(courseId)

  if (!firstChapter || !firstChapter.parts || firstChapter.parts.length === 0) {
    return null
  }

  const firstArticleRef = firstChapter.parts[0]

  if (!firstArticleRef) {
    return null
  }

  if (typeof firstArticleRef === 'number') {
    return getPartById(firstArticleRef)
  }

  return firstArticleRef
}

export const getLastArticle = async (chapter: Chapter): Promise<CoursePart | null> => {
  if (!chapter.parts || chapter.parts.length === 0) {
    return null
  }

  const lastPartRef = chapter.parts[chapter.parts.length - 1]

  if (typeof lastPartRef === 'number') {
    try {
      return await getPartById(lastPartRef)
    } catch {
      return null
    }
  }
  return lastPartRef
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
    const part = typeof partRef === 'number' ? await getPartById(partRef) : partRef
    if (part?.slug === partSlug) {
      foundPart = part
      break
    }
  }

  if (!foundPart) {
    throw new Error(
      `Part with slug "${partSlug}" not found in chapter "${chapterSlug}" of course "${courseSlug}"`,
    )
  }

  return foundPart
}

type NavigationInfo = {
  chapterSlug: string | null
  partSlug: string | null
}

export async function getNavigationParts(
  courseSlug: string,
  currentChapterSlug: string,
  currentPartSlug: string,
): Promise<{ prev: NavigationInfo; next: NavigationInfo }> {
  const payload = await getPayload({ config })
  const course = await getCourseBySlug(courseSlug)

  if (!course || !course.orderedChapters || course.orderedChapters.length === 0) {
    throw new Error(`Course "${courseSlug}" not found or has no chapters.`)
  }

  const resolvedChapters: (Chapter | null)[] = await Promise.all(
    course.orderedChapters.map(async (chapRef) => {
      if (typeof chapRef === 'number') {
        try {
          return await payload.findByID({ collection: 'chapters', id: chapRef, depth: 1 })
        } catch {
          return null
        }
      }
      return chapRef as Chapter
    }),
  )

  const validChapters = resolvedChapters.filter((chap): chap is Chapter => chap !== null)

  const currentChapterIndex = validChapters.findIndex((chap) => chap.slug === currentChapterSlug)
  if (currentChapterIndex === -1) {
    throw new Error(`Chapter "${currentChapterSlug}" not found within course "${courseSlug}".`)
  }
  const currentChapter = validChapters[currentChapterIndex]

  if (!currentChapter.parts || currentChapter.parts.length === 0) {
    throw new Error(`Chapter "${currentChapterSlug}" has no parts.`)
  }

  const resolvedCurrentParts = await Promise.all(
    (currentChapter.parts || []).map(async (partRef) => {
      if (typeof partRef === 'number') {
        try {
          return await getPartById(partRef)
        } catch {
          return null
        }
      }
      return partRef as CoursePart
    }),
  )
  const validCurrentParts = resolvedCurrentParts.filter((part): part is CoursePart => part !== null)

  const currentPartIndex = validCurrentParts.findIndex((part) => part.slug === currentPartSlug)
  if (currentPartIndex === -1) {
    throw new Error(`Part "${currentPartSlug}" not found within chapter "${currentChapterSlug}".`)
  }

  let prevInfo: NavigationInfo = { chapterSlug: null, partSlug: null }
  if (currentPartIndex > 0) {
    prevInfo = {
      chapterSlug: currentChapterSlug,
      partSlug: validCurrentParts[currentPartIndex - 1].slug,
    }
  } else if (currentChapterIndex > 0) {
    const prevChapter = validChapters[currentChapterIndex - 1]
    const lastPartInPrevChapter = await getLastArticle(prevChapter)
    if (lastPartInPrevChapter) {
      prevInfo = { chapterSlug: prevChapter.slug, partSlug: lastPartInPrevChapter.slug }
    }
  }

  let nextInfo: NavigationInfo = { chapterSlug: null, partSlug: null }
  if (currentPartIndex < validCurrentParts.length - 1) {
    nextInfo = {
      chapterSlug: currentChapterSlug,
      partSlug: validCurrentParts[currentPartIndex + 1].slug,
    }
  } else if (currentChapterIndex < validChapters.length - 1) {
    const nextChapter = validChapters[currentChapterIndex + 1]
    const resolvedNextParts = await Promise.all(
      (nextChapter.parts || []).map(async (partRef) => {
        if (typeof partRef === 'number') {
          try {
            return await getPartById(partRef)
          } catch {
            return null
          }
        }
        return partRef as CoursePart
      }),
    )
    const validNextParts = resolvedNextParts.filter((part): part is CoursePart => part !== null)

    if (validNextParts.length > 0) {
      nextInfo = { chapterSlug: nextChapter.slug, partSlug: validNextParts[0].slug }
    }
  }

  return { prev: prevInfo, next: nextInfo }
}
