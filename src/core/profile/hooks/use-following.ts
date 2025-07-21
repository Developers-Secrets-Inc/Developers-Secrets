import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getFollowing } from '../follow'
import { User } from '@/types/user'

export const useFollowing = (userId: string) => {
  return useQuery<User[]>({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  })
}

export const useFollowingCount = (userId: string) => {
  const { data: following } = useFollowing(userId)
  return following?.length || 0
}

export const useInvalidateFollowing = () => {
  const queryClient = useQueryClient()
  return (userId: string) => {
    queryClient.invalidateQueries({ queryKey: ['following', userId] })
  }
}
