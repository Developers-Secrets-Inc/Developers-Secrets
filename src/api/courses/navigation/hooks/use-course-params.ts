'use client'

import { useParams } from 'next/navigation'

export const useCourseParams = () => {
  const params = useParams()
  
  return {
    courseSlug: params.course_slug as string,
    chapterSlug: params.chapter_slug as string,
    partSlug: params.part_slug as string,
  }
}