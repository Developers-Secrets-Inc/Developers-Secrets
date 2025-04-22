import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getFollowers } from '../follow'
import { User } from '@/types/user'

export const useFollowers = (userId: string) => {
  return useQuery<User[]>({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  })
}

export const useFollowersCount = (userId: string) => {
  const { data: followers } = useFollowers(userId)
  return followers?.length || 0
}

export const useInvalidateFollowers = () => {
  const queryClient = useQueryClient()
  return (userId: string) => {
    queryClient.invalidateQueries({ queryKey: ['followers', userId] })
  }
}
