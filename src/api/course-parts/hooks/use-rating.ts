'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  rateCoursePartAction,
  removeCoursePartRatingAction,
  getUserCoursePartRating,
} from '@/api/course-parts/user-progression/actions'

interface UseCoursePartRatingProps {
  coursePartId: number
  userId: string
}

export const useCoursePartRating = ({ coursePartId, userId }: UseCoursePartRatingProps) => {
  const queryClient = useQueryClient()

  const queryKey = ['coursePartRating', coursePartId, userId]

  const {
    data: rating,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!coursePartId || !userId) {
        return null
      }
      return getUserCoursePartRating(userId, coursePartId)
    },
    enabled: !!coursePartId && !!userId,
    staleTime: Infinity, // Ratings don't change often
  })

  const rateMutation = useMutation({
    mutationFn: async (params: { userId: string; coursePartId: number; rating: number }) => {
      if (!params.coursePartId) throw new Error('Course Part ID is missing.')
      return rateCoursePartAction(params.coursePartId, params.rating)
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: queryKey })
      const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, params.rating)
      return { previousData }
    },
    onError: (err, params, context) => {
      queryClient.setQueryData(queryKey, context?.previousData)
      console.error('Error rating course part:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const removeRatingMutation = useMutation({
    mutationFn: async () => {
      if (!coursePartId) throw new Error('Course Part ID is missing.')
      return removeCoursePartRatingAction(coursePartId)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey })
      const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, null)
      return { previousData }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousData)
      console.error('Error removing course part rating:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const handleRating = (params: { userId: string; coursePartId: number; rating: number }) => {
    rateMutation.mutate(params)
  }

  const handleRemoveRating = () => {
    removeRatingMutation.mutate()
  }

  return {
    currentRating: rating,
    isLoading,
    rateCoursePartMutation: rateMutation,
    removeRatingMutation: removeRatingMutation,
    handleRating,
    handleRemoveRating,
    error: isError ? error?.message : null,
  }
}
