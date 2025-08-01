import { getCourseCompletedPartsCount } from '@/core/courses/progression/completion-status'
import { useQuery } from '@tanstack/react-query'
import { GridCourseInformations } from '../actions'

export function useCourseProgression(userId: string, course: GridCourseInformations) {
  return useQuery({
    queryKey: ['course-progression', userId, course?.id],
    queryFn: async () => {
      const allPartsIds = course?.allPartsIds
      const totalPartsCount = course?.totalPartsCount
      if (!userId || !allPartsIds || !Array.isArray(allPartsIds) || !totalPartsCount) {
        return { percentage: 0, completedCount: 0 }
      }
      const completedCount = await getCourseCompletedPartsCount(userId, allPartsIds)
      const percentage =
        totalPartsCount > 0 ? Math.round((completedCount / totalPartsCount) * 100) : 0
      return { percentage, completedCount }
    },
    enabled: !!userId && !!course?.id,
  })
}
