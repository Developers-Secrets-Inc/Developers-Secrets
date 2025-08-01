'use client'

import { Course } from '@/payload-types'
import { Gauge } from '@/components/ui/gauge'
import { useCourseProgression } from '@/core/courses/hooks/use-course-progression'
import { GridCourseInformations } from '../../actions'

export const CourseProgressionGauge = ({ course, userId }: { course: GridCourseInformations; userId: string }) => {
  const { data, isLoading, refetch } = useCourseProgression(userId, course)

  if (isLoading) {
    return (
      <div className="h-[36px] w-[36px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <Gauge value={data?.percentage ?? 0} size="small" showValue={true} />
}
