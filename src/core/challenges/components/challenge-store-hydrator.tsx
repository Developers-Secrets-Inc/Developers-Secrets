'use client'

import { useEffect, useRef } from 'react'
import { initializeChallengeStore } from '@/core/challenges/store'
import { Challenge as PayloadChallenge } from '@/payload-types'
import { User } from '@/types/user'

interface ChallengeStoreHydratorProps {
  challenge: PayloadChallenge
  user: User
  children: React.ReactNode
}

export const ChallengeStoreHydrator = ({
  challenge,
  user,
  children,
}: ChallengeStoreHydratorProps) => {
  const initialized = useRef(false)

  if (!initialized.current) {
    initializeChallengeStore({ challenge, user })
    initialized.current = true
  }

  return <>{children}</>
}
