'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { setUserCompletionStatus } from '@/core/challenges/user-progression'

type ChallengeStatusContextType = {
  status: CompletionStatus
  updateStatus: (newStatus: CompletionStatus) => Promise<void>
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
  const [status, setStatus] = useState<CompletionStatus>(initialStatus)

  const updateStatus = useCallback(
    async (newStatus: CompletionStatus) => {
      setStatus(newStatus)
      await setUserCompletionStatus(userId, challengeId, newStatus)
    },
    [userId, challengeId],
  )

  return (
    <ChallengeStatusContext.Provider value={{ status, updateStatus }}>
      {children}
    </ChallengeStatusContext.Provider>
  )
}

