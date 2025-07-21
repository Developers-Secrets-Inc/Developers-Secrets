'use client'

import { useCourseLastVisitDate } from '@/core/courses/hooks/use-course-last-visit-date'

export const CourseLastVisitDate = ({ courseSlug }: { courseSlug: string }) => {
  const [lastVisitedText] = useCourseLastVisitDate(courseSlug)
  return <span className="text-xs text-muted-foreground">{lastVisitedText}</span>
}
