import { useQuery } from '@tanstack/react-query'
import { getUser } from '..'
import { User } from '@/core/users/types'

export const useSessionUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User | null>({
    queryKey: ['sessionUser'],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  return {
    user,
    isLoading,
    isError,
    error,
  }
}
