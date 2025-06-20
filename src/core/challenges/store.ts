import { create } from 'zustand'
import { Challenge as PayloadChallenge } from '@/payload-types'
import { User } from '@/types/user'

interface ChallengeStoreState {
  challenge: PayloadChallenge | null
  user: User | null
  setChallenge: (challenge: PayloadChallenge) => void
  setUser: (user: User) => void
}

export const useChallengeStore = create<ChallengeStoreState>()((set) => ({
  challenge: null,
  user: null,
  setChallenge: (challenge) => set({ challenge }),
  setUser: (user) => set({ user }),
}))

interface InitialState {
  challenge: PayloadChallenge
  user: User
}

export const initializeChallengeStore = ({ challenge, user }: InitialState) => {
  useChallengeStore.setState({ challenge, user })
}
