import { create } from 'zustand'
import { Challenge as PayloadChallenge } from '@/payload-types'
import { User } from '@/types/user'

interface ChallengeStoreState {
  challenge: PayloadChallenge | null
  user: User | null
  setChallenge: (challenge: PayloadChallenge) => void
  setUser: (user: User) => void
  currencyOnCompletion: number
  setCurrencyOnCompletion: (currencyOnCompletion: number) => void
}

export const useChallengeStore = create<ChallengeStoreState>()((set) => ({
  challenge: null,
  user: null,
  currencyOnCompletion: 0,
  setChallenge: (challenge) => set({ challenge }),
  setUser: (user) => set({ user }),
  setCurrencyOnCompletion: (currencyOnCompletion) => set({ currencyOnCompletion }),
}))

interface InitialState {
  challenge: PayloadChallenge
  user: User
  currencyOnCompletion: number
}

export const initializeChallengeStore = ({
  challenge,
  user,
  currencyOnCompletion,
}: InitialState) => {
  useChallengeStore.setState({ challenge, user, currencyOnCompletion })
}
