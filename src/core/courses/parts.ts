'use server'

import 'server-only'
import { getCourseById, getCourseBySlug } from '.'
import { Chapter, CoursePart, Course } from '@/payload-types'
import { getChapterBySlug, getFirstChapter, getChapterById } from './chapters'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { checkChapterPrerequisites } from './progression/actions'
import {
  getAllUserPartCompletionStatusesForChapter,
  getUserChapterCompletionStatus,
  CompletionStatus,
} from './progression/completion-status'
import { unstable_cache } from 'next/cache'

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

export type NavigationInfo = {
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

// --- NEW STATIC DATA FETCHING FUNCTION ---

// Type for the static course outline data
export type CourseOutlineStaticData = {
  chapterId: number
  chapterSlug: string
  chapterName: string
  parts: { id: number; name: string; slug: string }[]
  requiredChapters?: (number | Chapter)[]
  status: CompletionStatus
}[]

// Type for the static footer parts data
export type FooterPartStaticData = Pick<CoursePart, 'id' | 'name' | 'slug'>

// Type for the return value of getCoursePartStaticData
export type CoursePartStaticData = {
  course: Course
  currentChapter: Chapter
  currentPart: CoursePart
  navigationParts: { prev: NavigationInfo; next: NavigationInfo }
  courseOutlineStatic: CourseOutlineStaticData
  chapterPartsForFooterStatic: FooterPartStaticData[]
}

/**
 * Fetches all necessary static (non-user-specific) data for the course part layout.
 * Calls notFound() if essential resources are missing.
 */
export const getCoursePartStaticData = unstable_cache(
  async (
    courseSlug: string,
    chapterSlug: string,
    partSlug: string,
  ): Promise<CoursePartStaticData> => {
    const payload = await getPayload({ config })
    let course: Course
    let currentChapter: Chapter
    let currentPart: CoursePart

    // 1. Fetch Course, Chapter, Part (handle notFound)
    try {
      const courseResult = await payload.find({
        collection: 'courses',
        where: { slug: { equals: courseSlug } },
        limit: 1,
        depth: 2, // Fetch chapters and potentially their first parts
      })
      if (!courseResult.docs[0]) throw new Error('Course not found')
      course = courseResult.docs[0]
    } catch (error) {
      console.error(`Error fetching course ${courseSlug}:`, error)
      notFound()
    }

    try {
      currentChapter = await getChapterBySlug(courseSlug, chapterSlug)
    } catch (error) {
      console.error(`Error fetching chapter ${chapterSlug} in course ${courseSlug}:`, error)
      notFound()
    }

    try {
      currentPart = await getPartBySlug(courseSlug, chapterSlug, partSlug)
    } catch (error) {
      console.error(`Error fetching part ${partSlug} in chapter ${chapterSlug}:`, error)
      notFound()
    }

    // 2. Fetch Navigation Parts
    const navigationParts = await getNavigationParts(courseSlug, chapterSlug, partSlug)

    // 3. Build Static Course Outline
    const courseOutlineStatic: CourseOutlineStaticData = await Promise.all(
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

    // 4. Build Static Footer Parts Data
    const chapterPartsForFooterStatic: FooterPartStaticData[] = await Promise.all(
      (currentChapter.parts || []).map(async (partRef) => {
        if (typeof partRef === 'number') {
          try {
            const part = await getPartById(partRef)
            return { id: part.id, name: part.name, slug: part.slug }
          } catch {
            return null
          }
        }
        // Ensure partRef is a CoursePart object before accessing properties
        if (
          typeof partRef === 'object' &&
          partRef !== null &&
          'id' in partRef &&
          'name' in partRef &&
          'slug' in partRef
        ) {
          return { id: partRef.id, name: partRef.name, slug: partRef.slug } as FooterPartStaticData
        }
        return null
      }),
    ).then((parts) => parts.filter((p): p is FooterPartStaticData => p !== null))

    return {
      course,
      currentChapter,
      currentPart,
      navigationParts,
      courseOutlineStatic,
      chapterPartsForFooterStatic,
    }
  },
  ['getCoursePartStaticData'],
  { revalidate: 3600 }
)

export const getCourseStaticOutline = unstable_cache(
  async (
    courseSlug: string,
  ): Promise<CourseOutlineStaticData> => {
    const course = await getCourseBySlug(courseSlug)
    if (!course) {
      throw new Error(`Course "${courseSlug}" not found.`)
    }
    const courseOutlineStatic: CourseOutlineStaticData = await Promise.all(
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
  },
  ['getCourseStaticOutline'],
  { revalidate: 3600 }
)

// --- NEW DYNAMIC DATA FETCHING FUNCTIONS ---

// Define ChapterPartStatusInfo here instead of importing from layout
export type ChapterPartStatusInfo = {
  id: number
  name: string
  slug: string
  status: CompletionStatus
}

// Type for the outline data with user-specific lock status and part status
export type CourseOutlineUserData = {
  chapterSlug: string
  chapterName: string
  parts: { id: number; name: string; slug: string; status: CompletionStatus }[]
  isLocked: boolean
}[]

/**
 * Augments the static course outline with user-specific lock status.
 * THIS IS THE ORIGINAL FUNCTION, KEPT FOR COMPATIBILITY OR OTHER USES.
 */
export const getUserSpecificCourseOutline = async (
  userId: string | null,
  staticOutline: CourseOutlineStaticData,
  course: Course, // This version needs the course object
): Promise<CourseOutlineUserData> => {
  // Original return type might differ slightly if it didn't include status
  // This is the original logic without part statuses
  if (!userId) {
    return Promise.all(
      staticOutline.map(async (staticChap) => {
        let isLocked = false
        if (staticChap.chapterId) {
          const chapterDoc = await getChapterById(staticChap.chapterId)
          isLocked = !!chapterDoc.requiredChapters && chapterDoc.requiredChapters.length > 0
        }
        // Map parts without adding status
        const partsWithoutStatus = staticChap.parts.map((part) => ({
          ...part,
          status: 'not_started' as CompletionStatus,
        })) // Add default status to match type
        return {
          chapterSlug: staticChap.chapterSlug,
          chapterName: staticChap.chapterName,
          parts: partsWithoutStatus, // Parts without status
          isLocked: isLocked,
        }
      }),
    )
  }
  return Promise.all(
    staticOutline.map(async (staticChap) => {
      let isLocked = true
      if (staticChap.chapterId) {
        isLocked = !(await checkChapterPrerequisites(userId, staticChap.chapterId))
      }
      const partsWithoutStatus = staticChap.parts.map((part) => ({
        ...part,
        status: 'not_started' as CompletionStatus,
      })) // Add default status to match type
      return {
        chapterSlug: staticChap.chapterSlug,
        chapterName: staticChap.chapterName,
        parts: partsWithoutStatus, // Parts without status
        isLocked: isLocked,
      }
    }),
  )
}

/**
 * Augments the static course outline with user-specific lock status and part completion status.
 */
export const getUserSpecificCourseOutlineWithStatus = async (
  userId: string | null,
  staticOutline: CourseOutlineStaticData,
): Promise<CourseOutlineUserData> => {
  // Create a flat list of all part IDs from the static outline for efficient status fetching
  const allPartIds = staticOutline.flatMap((chapter) => chapter.parts.map((part) => part.id))
  let allPartStatuses: Record<number, CompletionStatus> = {}

  // Fetch all part statuses at once if the user is logged in
  if (userId && allPartIds.length > 0) {
    allPartStatuses = await getAllUserPartCompletionStatusesForChapter(userId, allPartIds)
  }

  // Process each chapter
  return Promise.all(
    staticOutline.map(async (staticChap) => {
      // Check chapter prerequisites for lock status
      let isLocked = true // Default to locked
      if (staticChap.chapterId) {
        // Use chapterId directly
        if (userId) {
          isLocked = !(await checkChapterPrerequisites(userId, staticChap.chapterId))
        } else {
          // Not logged in: locked if it requires prerequisites
          isLocked = !!staticChap.requiredChapters && staticChap.requiredChapters.length > 0
        }
      }

      // Map parts and add their status
      const partsWithStatus = staticChap.parts.map((part) => ({
        ...part,
        // Use fetched status or default to 'not_started'
        status: allPartStatuses[part.id] || 'not_started',
      }))

      return {
        chapterSlug: staticChap.chapterSlug,
        chapterName: staticChap.chapterName,
        parts: partsWithStatus,
        isLocked: isLocked,
      }
    }),
  )
}

/**
 * Augments the static footer parts data with user-specific completion status.
 */
export const getUserSpecificFooterData = async (
  userId: string | null,
  chapterPartsStatic: FooterPartStaticData[],
): Promise<ChapterPartStatusInfo[]> => {
  let partStatuses: Record<number, CompletionStatus> = {}
  if (userId && chapterPartsStatic.length > 0) {
    const partIds = chapterPartsStatic.map((p) => p.id)
    partStatuses = await getAllUserPartCompletionStatusesForChapter(userId, partIds)
  }

  return chapterPartsStatic.map((part) => ({
    id: part.id,
    name: part.name,
    slug: part.slug,
    // Default to not_started if no user or no status found
    status: partStatuses[part.id] || 'not_started',
  }))
}

/**
 * Determines if the 'Next' button should be initially locked based on chapter completion.
 */
export const getNextButtonLockState = async (
  userId: string | null,
  currentChapterId: number,
  currentChapterSlug: string, // Added slug for comparison
  nextPartUrl: string | null,
): Promise<boolean> => {
  if (!userId || !nextPartUrl) {
    return false // No lock if no user or no next part
  }

  // Extract target chapter slug from the nextPartUrl
  const urlParts = nextPartUrl.split('/')
  if (urlParts.length !== 5 || urlParts[1] !== 'courses') {
    return false // Invalid URL format
  }
  const nextChapterSlugFromUrl = urlParts[3]

  // Only lock if the next part is in a DIFFERENT chapter
  if (nextChapterSlugFromUrl !== currentChapterSlug) {
    const currentChapterStatus = await getUserChapterCompletionStatus(userId, currentChapterId)
    // Lock if the current chapter is not completed
    return currentChapterStatus !== 'completed'
  }

  // If next part is in the same chapter, it's not locked by chapter completion
  return false
}
