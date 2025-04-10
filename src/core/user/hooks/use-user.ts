import { useQuery } from '@tanstack/react-query'
import { getUser } from '..'
import { User } from '@/types/user'

export const useUser = () => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  return {
    user,
    isLoading,
  }
}
