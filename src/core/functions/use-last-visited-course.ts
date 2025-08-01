import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateLastVisitedCourse, getLastVisitedCourse } from '@/api/courses/last-visited'

// Hook pour récupérer le dernier cours visité
export function useLastVisitedCourse(userId: string | undefined) {
  return useQuery({
    queryKey: ['last-visited-course', userId],
    queryFn: () => {
      if (!userId) return null
      return getLastVisitedCourse({ userId })
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour mettre à jour le dernier cours visité
export function useUpdateLastVisitedCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: {
      courseSlug: string
      chapterSlug: string
      partSlug: string
      userId: string
    }) => updateLastVisitedCourse(variables),
    onSuccess: (data, variables) => {
      // Revalidation du cache
      queryClient.invalidateQueries({
        queryKey: ['last-visited-course', variables.userId],
      })
    },
  })
}
