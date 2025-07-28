'use client'

import { Challenge, ChallengeAiChat } from '@/payload-types'
import { ChallengeContext } from '../challenge-context'
import { Message } from 'ai'
import { useEffect, useRef } from 'react'
import { useStoreReset } from '../../hooks/use-store-reset'

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
  const { resetAllStores } = useStoreReset()
  const previousChallengeId = useRef<string | number | null>(null)

  useEffect(() => {
    // Reset stores only when challenge changes
    if (previousChallengeId.current !== null && previousChallengeId.current !== challenge.id) {
      resetAllStores()
    }
    previousChallengeId.current = challenge.id
  }, [challenge.id, resetAllStores])

  return <ChallengeContext.Provider value={{ challenge, metadata }}>{children}</ChallengeContext.Provider>
}
