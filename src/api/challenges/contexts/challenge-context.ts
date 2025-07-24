'use client'

import { createContext, useContext } from 'react'
import { Challenge } from '@/payload-types'

export type ChallengeContextType = {
  challenge: Challenge
}

export const ChallengeContext = createContext<ChallengeContextType | null>(null)

export const useChallenge = () => {
  const context = useContext(ChallengeContext)

  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider')
  }

  return context
}
