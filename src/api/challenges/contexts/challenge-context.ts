'use client'

import { createContext, useContext } from 'react'
import { Challenge, ChallengeAiChat } from '@/payload-types'
import { Message } from 'ai'

export type ChallengeContextType = {
  challenge: Challenge
  metadata: {
    challengeAiChat: ChallengeAiChat
    messages: Message[]
    quotas: number
    completionCurrency: number
  }
}

export const ChallengeContext = createContext<ChallengeContextType | null>(null)

export const useChallenge = () => {
  const context = useContext(ChallengeContext)

  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider')
  }

  return context
}
