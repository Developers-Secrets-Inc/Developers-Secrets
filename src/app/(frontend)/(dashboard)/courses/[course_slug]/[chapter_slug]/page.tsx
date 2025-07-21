import { redirect } from 'next/navigation'
import { getCourseBySlug } from '@/core/courses' // Assuming this exists
import { getChapterById } from '@/core/courses/chapters'
import { getPartById } from '@/core/courses/parts'
import { notFound } from 'next/navigation'
import type { Chapter, CoursePart } from '@/payload-types'

interface PageProps {
  params: {
    course_slug: string
    chapter_slug: string
  }
}

// Helper function to get the first part slug from a chapter
async function getFirstPartSlug(chapter: Chapter | number): Promise<string | null> {
  let resolvedChapter: Chapter
  if (typeof chapter === 'number') {
    try {
      resolvedChapter = await getChapterById(chapter)
    } catch (error) {
      console.error('Error fetching chapter by ID:', error)
      return null
    }
  } else {
    resolvedChapter = chapter
  }

  if (!resolvedChapter.parts || resolvedChapter.parts.length === 0) {
    return null // No parts in this chapter
  }

  const firstPartRef = resolvedChapter.parts[0]
  let firstPart: CoursePart

  if (typeof firstPartRef === 'number') {
    try {
      firstPart = await getPartById(firstPartRef)
    } catch (error) {
      console.error('Error fetching part by ID:', error)
      return null
    }
  } else {
    firstPart = firstPartRef
  }

  return firstPart.slug
}

export default async function ChapterRedirectPage({ params }: PageProps) {
  const { course_slug, chapter_slug } = params

  try {
    // 1. Fetch the course by slug
    const course = await getCourseBySlug(course_slug) // Need to ensure this function exists and works
    if (!course || !course.orderedChapters) {
      console.warn(`Course or chapters not found for slug: ${course_slug}`)
      notFound() // Or redirect to a general courses page
    }

    // 2. Find the target chapter within the course by slug
    // Need to resolve chapter references if they are numbers
    const resolvedChapters = await Promise.all(
      (course.orderedChapters || []).map(async (chapRef) => {
        if (typeof chapRef === 'number') {
          try {
            return await getChapterById(chapRef)
          } catch {
            return null
          } // Handle cases where chapter ID might be invalid
        }
        return chapRef as Chapter // Assume it's already populated if not a number
      }),
    )

    const targetChapter: Chapter | null | undefined = resolvedChapters.find(
      (chap) => chap?.slug === chapter_slug,
    )

    if (!targetChapter) {
      console.warn(`Chapter not found for slug: ${chapter_slug} in course: ${course_slug}`)
      notFound() // Chapter doesn't exist or isn't part of this course
    }

    // 3. Get the slug of the first part (article) of the chapter
    const firstPartSlug = await getFirstPartSlug(targetChapter)

    if (!firstPartSlug) {
      console.warn('First part slug not found')
      notFound()
    }

    // Redirect to the first part
    redirect(`/courses/${course_slug}/${firstPartSlug}`)
  } catch (error) {
    console.error('Error in ChapterRedirectPage:', error)
    notFound()
  }
}
