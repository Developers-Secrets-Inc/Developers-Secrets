'use client'

import { useQuery } from '@tanstack/react-query'
 import { getUserCurrency } from '..'
 import { useUser } from '@/core/users/contexts/user-context'
 import { match } from '@/lib/maybe'

export const useUserCurrency = () => {
  const { user } = useUser()

  return useQuery({
    queryKey: ['user-currency', user.id],
    queryFn: async () => {
      const res = await getUserCurrency({ userId: user.id })
      return match(res,
         (currency) => [currency],
         () => [],
       )
    },
  })
}