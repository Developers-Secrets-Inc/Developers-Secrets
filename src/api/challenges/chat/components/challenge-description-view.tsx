'use client'

import React, { Suspense } from 'react'


import { useUser } from '@/core/users/contexts/user-context'
import { ChallengeLayout } from '../../components/sections/layout'
import { useChallenge } from '../../contexts/challenge-context'
import { EngagementButtons } from '../../engagement/components/engagement-buttons.client'
import { RatingDialogButton } from '../../engagement/components/rating-dialog'
import { PearlToggleButton } from './pearl/pearl-toggle-button'

function LoadingPlaceholder() {
  return <div className="animate-pulse p-6 bg-background/50 rounded-md h-[200px]"></div>
}

interface ChallengeDescriptionViewProps {
  children: React.ReactNode
}

export function ChallengeDescriptionView({ children }: ChallengeDescriptionViewProps) {
  const { challenge } = useChallenge()
  const { user } = useUser()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">
        <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
      </div>

      <ChallengeLayout.FooterContainer>
        <ChallengeLayout.FooterLeftPart>
          {user && challenge && (
            <>
              <EngagementButtons userId={user.id} challengeId={challenge.id} />
              <RatingDialogButton userId={user.id} challengeId={challenge.id} />
            </>
          )}
        </ChallengeLayout.FooterLeftPart>
        <PearlToggleButton />
      </ChallengeLayout.FooterContainer>
    </div>
  )
}



