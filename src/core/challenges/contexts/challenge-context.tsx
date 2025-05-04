'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import type { Challenge } from '@/payload-types' // Assuming Payload Challenge type

// 1. Define the type for the context value
// It will contain the full Challenge object, or null initially.
type ChallengeContextType = Challenge | null

// 2. Create the Context with a default value (null)
const ChallengeContext = createContext<ChallengeContextType>(null)

// 3. Create the Provider Component
interface ChallengeProviderProps {
  children: ReactNode
  challenge: Challenge // The provider receives the 'challenge' fetched on the server-side
}

export const ChallengeProvider = ({ children, challenge }: ChallengeProviderProps) => {
  // The value provided by the context is simply the 'challenge' object
  return <ChallengeContext.Provider value={challenge}>{children}</ChallengeContext.Provider>
}

// 4. Create the custom Hook to consume the context
export const useChallenge = (): Challenge => {
  const context = useContext(ChallengeContext)

  // Verification to ensure the hook is used within a Provider
  if (context === null) {
    throw new Error('useChallenge must be used within a ChallengeProvider')
  }

  return context
}
