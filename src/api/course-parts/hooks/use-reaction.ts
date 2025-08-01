'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleCoursePartLike,
  toggleCoursePartDislike,
  hasUserLikedCoursePart,
  hasUserDislikedCoursePart,
} from '@/api/course-parts/user-progression/actions'

interface UseCoursePartReactionProps {
  coursePartId: number
  userId: string
  initial?: any
}

export const useCoursePartReaction = ({ coursePartId, userId, initial }: UseCoursePartReactionProps) => {
  const queryClient = useQueryClient()

  const queryKey = ['coursePartReaction', coursePartId, userId]

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!coursePartId || !userId) {
        // Return default state if IDs are not available
        return { liked: false, disliked: false }
      }
      const [liked, disliked] = await Promise.all([
        hasUserLikedCoursePart(userId, coursePartId),
        hasUserDislikedCoursePart(userId, coursePartId),
      ])
      return { liked, disliked }
    },
    // Only enable the query if both coursePartId and userId are available
    enabled: !!coursePartId && !!userId,
    staleTime: Infinity, // Reactions don't change often
  })

  const likeMutation = useMutation({
    mutationFn: async (newLikedState: boolean) => {
      if (!coursePartId) throw new Error('Course Part ID is missing.')
      return toggleCoursePartLike(newLikedState, coursePartId)
    },
    onMutate: async (newLikedState) => {
      await queryClient.cancelQueries({ queryKey: queryKey })
      const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        liked: newLikedState,
        disliked: newLikedState ? false : old?.disliked, // If liking, cannot be disliked
      }))
      return { previousData }
    },
    onError: (err, newLikedState, context) => {
      queryClient.setQueryData(queryKey, context?.previousData)
      console.error('Error toggling like:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const dislikeMutation = useMutation({
    mutationFn: async (newDislikedState: boolean) => {
      if (!coursePartId) throw new Error('Course Part ID is missing.')
      return toggleCoursePartDislike(newDislikedState, coursePartId)
    },
    onMutate: async (newDislikedState) => {
      await queryClient.cancelQueries({ queryKey: queryKey })
      const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        disliked: newDislikedState,
        liked: newDislikedState ? false : old?.liked, // If disliking, cannot be liked
      }))
      return { previousData }
    },
    onError: (err, newDislikedState, context) => {
      queryClient.setQueryData(queryKey, context?.previousData)
      console.error('Error toggling dislike:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })

  const handleLikeClick = () => {
    likeMutation.mutate(!data?.liked)
  }

  const handleDislikeClick = () => {
    dislikeMutation.mutate(!data?.disliked)
  }

  return {
    liked: data?.liked ?? initial?.liked ?? false,
    disliked: data?.disliked ?? initial?.disliked ?? false,
    isLoading,
    handleLikeClick,
    handleDislikeClick,
    error: isError ? error?.message : null,
  }
}
