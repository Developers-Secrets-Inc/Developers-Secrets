'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { setUserCompletionStatus } from '@/core/challenges/user-progression'

type ChallengeStatusContextType = {
  visualStatus: CompletionStatus
  persistedStatus: CompletionStatus
  updateVisualStatus: (newStatus: CompletionStatus) => void
  updatePersistedStatus: (newStatus: CompletionStatus) => Promise<void>
}

export const ChallengeStatusContext = createContext<ChallengeStatusContextType | null>(null)

type ChallengeStatusProviderProps = {
  children: ReactNode
  challengeId: number
  userId: string
  initialStatus?: CompletionStatus
}

export const ChallengeStatusProvider = ({
  children,
  challengeId,
  userId,
  initialStatus = 'not_started',
}: ChallengeStatusProviderProps) => {
  const [visualStatus, setVisualStatus] = useState<CompletionStatus>(initialStatus)
  const [persistedStatus, setPersistedStatus] = useState<CompletionStatus>(initialStatus)

  const updateVisualStatus = useCallback((newStatus: CompletionStatus) => {
    setVisualStatus(newStatus)
  }, [])

  const updatePersistedStatus = useCallback(
    async (newStatus: CompletionStatus) => {
      await setUserCompletionStatus(userId, challengeId, newStatus)
      setPersistedStatus(newStatus)
      setVisualStatus(newStatus)
    },
    [userId, challengeId],
  )

  return (
    <ChallengeStatusContext.Provider
      value={{
        visualStatus,
        persistedStatus,
        updateVisualStatus,
        updatePersistedStatus,
      }}
    >
      {children}
    </ChallengeStatusContext.Provider>
  )
}
