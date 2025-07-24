'use client'

import { Challenge } from '@/payload-types'
import { ChallengeContext } from '../challenge-context'

export const ChallengeProvider = ({
  children,
  challenge,
}: {
  children: React.ReactNode
  challenge: Challenge
}) => {
  return <ChallengeContext.Provider value={{ challenge }}>{children}</ChallengeContext.Provider>
}
