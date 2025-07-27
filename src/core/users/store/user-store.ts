import { create } from 'zustand'
import { User } from '../types'
import { Maybe, none, some } from '@/lib/maybe'

type UserStore = {
  user: Maybe<User>
  isHydrated: boolean
  initialize: (user: User) => void
  setHydrated: (isHydrated: boolean) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: none(),
  isHydrated: false,
  initialize: (user) => set({ user: some(user) }),
  setHydrated: (isHydrated) => set({ isHydrated }),
}))
