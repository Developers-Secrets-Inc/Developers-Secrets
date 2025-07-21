'use client'

import { useEffect } from 'react'
import { useChallengeTimer } from '../hooks/use-challenge-timer'

export const ChallengeTimerStarter = ({ challengeId }: { challengeId: number }) => {
  const { startTimer, startTime } = useChallengeTimer(challengeId)

  useEffect(() => {
    if (!startTime) {
      startTimer()
    }
  }, [startTimer, startTime])

  return null
}
