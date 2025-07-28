'use client'

import { Challenge, ChallengeAiChat } from '@/payload-types'
import { ChallengeContext } from '../challenge-context'
import { Message } from 'ai'

export const ChallengeProvider = ({
  children,
  challenge,
  metadata
}: {
  children: React.ReactNode
  challenge: Challenge
  metadata: {
    challengeAiChat: ChallengeAiChat
    messages: Message[]
    quotas: number
    completionCurrency: number
  }
}) => {
  // Note: Store reset is handled by useChallengeLifecycle hook in ChallengeExercice
  // The key prop on this component ensures proper remounting when challenge changes
  
  return (
    <ChallengeContext.Provider value={{ challenge, metadata }}>
      {children}
    </ChallengeContext.Provider>
  )
}
