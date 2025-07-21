'use client'

import { Course } from '@/payload-types'
import { LinkButton } from '@/components/common/link-button'
import { useCourseButton } from '@/core/courses/hooks/use-course-button'

export const CourseButton = ({
  course,
  userId,
  isStarted: initialIsStarted,
}: {
  course: Course
  userId: string
  isStarted: boolean
}) => {
  const { isStarted, isLoading } = useCourseButton(userId, course.id, initialIsStarted)
  const courseLink = isLoading ? '#' : `/courses/${course.slug}`
  const content = isLoading ? 'Loading...' : isStarted ? 'Continue' : 'Start Course'

  return (
    <LinkButton href={courseLink} disabled={isLoading}>
      {content}
    </LinkButton>
  )
}
