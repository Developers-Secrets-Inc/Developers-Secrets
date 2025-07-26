'use client'

import { useEffect } from 'react'
import { useChallengeTimer } from '../hooks/use-challenge-timer'
import { useChallenge } from '@/api/challenges/contexts/challenge-context'

export const ChallengeTimerStarter = () => {
  const { challenge } = useChallenge()
  const { startTimer, startTime } = useChallengeTimer(challenge.id)

  useEffect(() => {
    if (!startTime) {
      startTimer()
    }
  }, [startTimer, startTime])

  return null
}
