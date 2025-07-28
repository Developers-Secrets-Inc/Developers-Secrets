'use client'

import { Challenge, ChallengeAiChat } from '@/payload-types'
import { ChallengeContext } from '../challenge-context'
import { Message } from 'ai'
import { useEffect, useRef } from 'react'
import { useStoreReset } from '../../hooks/use-store-reset'

// Key for tracking challenge changes in sessionStorage
const CHALLENGE_TRACKING_KEY = 'current-challenge-id'

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
  const { resetUIStores, resetEditorStores, resetAllStores } = useStoreReset()
  const previousChallengeId = useRef<string | number | null>(null)

  useEffect(() => {
    const currentChallengeId = challenge.id.toString()
    const storedChallengeId = sessionStorage.getItem(CHALLENGE_TRACKING_KEY)
    const isFirstLoad = previousChallengeId.current === null
    const isChallengeChange = storedChallengeId !== currentChallengeId
    const isPageRefresh = storedChallengeId === currentChallengeId && isFirstLoad

    if (isFirstLoad) {
      if (isChallengeChange) {
        // True challenge change: reset everything
        resetAllStores()
      } else if (isPageRefresh) {
        // Page refresh: only reset UI stores, preserve editor state
        resetUIStores()
      }
    } else if (isChallengeChange) {
      // Challenge change during session: reset everything
      resetAllStores()
    }

    // Update tracking
    sessionStorage.setItem(CHALLENGE_TRACKING_KEY, currentChallengeId)
    previousChallengeId.current = challenge.id
  }, [challenge.id, resetUIStores, resetEditorStores, resetAllStores])

  return <ChallengeContext.Provider value={{ challenge, metadata }}>{children}</ChallengeContext.Provider>
}
