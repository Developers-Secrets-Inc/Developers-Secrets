import { useQuery } from '@tanstack/react-query'
import { getUser } from '../index'
import { User } from '../types'

export const useUser = () => {
  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['sessionUser'],
    queryFn: getUser,
  })

  return {
    user: result && result._tag === 'success' ? (result.value as User) : undefined,
    isLoading,
    isError,
    error: result && result._tag === 'failure' ? result.error : error,
  }
}
