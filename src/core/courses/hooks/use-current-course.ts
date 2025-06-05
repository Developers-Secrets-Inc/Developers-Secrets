'use client'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getCourseProgressSummary, CourseProgressSummary } from '@/core/courses'
import { getUser } from '@/core/user'

export function useCurrentCourse() {
  const [lastCourseSlug, setLastCourseSlug] = useState<string | null>(null)
  const [lastUrl, setLastUrl] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Hydrate depuis localStorage et user
  useEffect(() => {
    setLastCourseSlug(
      typeof window !== 'undefined' ? localStorage.getItem('lastVisitedCourseSlug') : null,
    )
    setLastUrl(typeof window !== 'undefined' ? localStorage.getItem('lastVisitedPartUrl') : null)
    getUser().then((user) => setUserId(user?.id ?? null))
  }, [])

  // Utilise React Query pour la progression
  const {
    data: courseProgress,
    isLoading,
    error,
  } = useQuery<CourseProgressSummary | null>({
    queryKey: ['current-course', userId, lastCourseSlug],
    queryFn: () =>
      userId && lastCourseSlug
        ? getCourseProgressSummary(userId, lastCourseSlug)
        : Promise.resolve(null),
    enabled: !!userId && !!lastCourseSlug,
    staleTime: 1000 * 60 * 10, // 10 min
  })

  return {
    lastCourseSlug,
    lastUrl,
    userId,
    courseProgress,
    isLoading,
    error,
  }
}
