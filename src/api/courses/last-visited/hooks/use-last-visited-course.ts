import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLastVisitedCourse, updateLastVisitedCourse } from '../index'
import type { UserLastVisitedCourse } from '@/payload-types'

// Types - Utilisation des types générés par Payload CMS
export type LastVisitedCourseData = UserLastVisitedCourse

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
export function useUpdateLastVisited() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      courseSlug: string
      chapterSlug: string
      partSlug: string
      userId: string
    }) => updateLastVisitedCourse(params),
    onSuccess: (_, variables) => {
      // Invalider le cache pour forcer le rechargement
      queryClient.invalidateQueries({
        queryKey: ['last-visited-course', variables.userId],
      })
    },
    onError: (error) => {
      console.error('Failed to update last visited course:', error)
    },
  })
}

// Hook combiné pour une utilisation simplifiée
export function useLastVisitedCourseWithUpdate(userId: string | undefined) {
  const query = useLastVisitedCourse(userId)
  const mutation = useUpdateLastVisited()

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateLastVisited: mutation.mutate,
    isUpdating: mutation.isPending,
  }
}
