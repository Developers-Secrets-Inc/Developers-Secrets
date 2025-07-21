import { getCourseCompletedPartsCount } from '@/core/courses/progression/completion-status'
import { useQuery } from '@tanstack/react-query'

// Note: 'course' is typed as 'any' to allow access to allPartIds and totalPartsCount (not in official Course type)
export function useCourseProgression(userId: string | null, course: any) {
  return useQuery({
    queryKey: ['course-progression', userId, course?.id],
    queryFn: async () => {
      const allPartIds = course?.allPartIds
      const totalPartsCount = course?.totalPartsCount
      if (!userId || !allPartIds || !Array.isArray(allPartIds) || !totalPartsCount) {
        return { percentage: 0, completedCount: 0 }
      }
      const completedCount = await getCourseCompletedPartsCount(userId, allPartIds)
      const percentage =
        totalPartsCount > 0 ? Math.round((completedCount / totalPartsCount) * 100) : 0
      return { percentage, completedCount }
    },
    enabled: !!userId && !!course?.id,
  })
}
