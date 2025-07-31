'use client'

import { useEffect } from 'react'
import { useUpdateLastVisited } from '@/api/courses/last-visited/hooks/use-last-visited-course'

interface UpdateLastVisitedProps {
  courseSlug: string
  chapterSlug: string
  partSlug: string
  userId: string
}

export function UpdateLastVisited({
  courseSlug,
  chapterSlug,
  partSlug,
  userId,
}: UpdateLastVisitedProps) {
  const { mutate: updateLastVisited } = useUpdateLastVisited()

  useEffect(() => {
    if (userId && courseSlug && chapterSlug && partSlug) {
      updateLastVisited({
        courseSlug,
        chapterSlug,
        partSlug,
        userId,
      })
    }
  }, [userId, courseSlug, chapterSlug, partSlug, updateLastVisited])

  return null
}