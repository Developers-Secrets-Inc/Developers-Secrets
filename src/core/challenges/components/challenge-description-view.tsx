'use client'

import React, { Suspense } from 'react'

// Importing the footer components that were just extracted
import {
  ChallengeFooterContainer,
  ChallengeFooterLeftPart,
} from '@/core/challenges/components/layout/challenge-footer'

// Importing other necessary components for the footer
import { ChallengeReactionButtons } from '@/core/challenges/components/reaction-buttons'
import { RatingText } from '@/components/rating-dialog'
import { PearlToggleButton } from '@/core/challenges/components/pearl/pearl-toggle-button'
import { useChallengeStore } from '../store'
import { EngagementButtons } from '@/api/challenges/engagement/components/engagement-buttons'

function LoadingPlaceholder() {
  return <div className="animate-pulse p-6 bg-background/50 rounded-md h-[200px]"></div>
}

interface ChallengeDescriptionViewProps {
  children: React.ReactNode
}

export function ChallengeDescriptionView({ children }: ChallengeDescriptionViewProps) {
  const { user, challenge } = useChallengeStore()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">
        <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
      </div>

      <ChallengeFooterContainer>
        <ChallengeFooterLeftPart>
          {user && challenge && (
            <>
              {/* <EngagementButtons userId={user.id} challengeId={challenge.id} /> */}
              <RatingText />
            </>
          )}
        </ChallengeFooterLeftPart>
        <PearlToggleButton />
      </ChallengeFooterContainer>
    </div>
  )
}
