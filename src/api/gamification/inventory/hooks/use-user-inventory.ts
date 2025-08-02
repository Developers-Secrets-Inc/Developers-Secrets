'use client'

import { useQuery } from '@tanstack/react-query'
 import { getUserInventory } from '..'
 import { useUser } from '@/core/users/contexts/user-context'
 import { match } from '@/lib/maybe'

export const useUserInventory = () => {
  const { user } = useUser()

  return useQuery({
    queryKey: ['user-inventory', user.id],
    queryFn: async () => {
      const res = await getUserInventory({ userId: user.id })
      return match(res,
         (inventory) => inventory,
         () => [],
       )
    },
  })
}