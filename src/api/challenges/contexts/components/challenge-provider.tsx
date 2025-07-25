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
  }
}) => {
  return <ChallengeContext.Provider value={{ challenge, metadata }}>{children}</ChallengeContext.Provider>
}
