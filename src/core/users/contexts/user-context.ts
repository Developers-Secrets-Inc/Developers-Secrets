'use client'

import { User } from '@/core/users/types'
import { createContext, useContext } from 'react'

export type UserContextType = {
  user: User
}

export const UserContext = createContext<UserContextType | null>(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
