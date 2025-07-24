'use client'

import { User } from '@/core/users/types'
import { UserContext } from '../user-context'

export const UserProvider = ({ children, user }: { children: React.ReactNode; user: User }) => {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
}
