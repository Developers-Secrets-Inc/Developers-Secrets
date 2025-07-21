'use client'

import { useQuery } from '@tanstack/react-query'
import { hasUserStartedCourse } from '@/core/courses/progression'

export function useCourseButton(userId: string, courseId: number, initialIsStarted?: boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ['user-course-started', userId, courseId],
    queryFn: () => hasUserStartedCourse(userId, courseId),
    enabled: !!userId && !!courseId,
    initialData: initialIsStarted,
  })

  return {
    isStarted: !!data,
    isLoading,
  }
}
