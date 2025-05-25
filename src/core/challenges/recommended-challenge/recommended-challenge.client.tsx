'use client'

import { LinkButton } from '@/components/common/link-button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { useRecommendedChallenge } from '@/core/skills/hooks/use-recommended-challenge'
import type { Challenge } from '@/payload-types'
import { RefreshCw, SearchX, Trophy } from 'lucide-react'
import { ChallengeDifficultyBadge } from './difficulty-badge'
import {
  RecommendedChallengeCard,
  RecommendedChallengeDescription,
  RecommendedChallengeExperience,
  RecommendedChallengeSkeleton,
  RecommendedChallengeTitle,
} from './index'

const RecommendedChallengeError = () => {
  return (
    <RecommendedChallengeCard>
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <SearchX className="h-12 w-12 text-destructive mb-4" />
        <CardTitle className="text-xl mb-1 text-destructive">Oops! Something went wrong.</CardTitle>
        <CardDescription className="mb-4">
          Failed to load the challenge. Please try again.
        </CardDescription>
      </div>
    </RecommendedChallengeCard>
  )
}

const RecommendedChallengeNotFound = () => {
  return (
    <RecommendedChallengeCard>
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
        <CardTitle className="text-xl mb-1">No challenges available right now</CardTitle>
        <CardDescription className="mb-4">
          Please check back later or try refreshing!
        </CardDescription>
      </div>
    </RecommendedChallengeCard>
  )
}

export const RecommendedChallengeClient = ({
  userId,
  initialChallenge,
}: {
  userId: string
  initialChallenge: Challenge | null
}) => {
  const { recommendedChallenge, isLoading, error, fetchNewRecommendationWithFeedback, isFetching } =
    useRecommendedChallenge({
      userId,
      initialData: initialChallenge,
    })

  if (isFetching && !recommendedChallenge) {
    return <RecommendedChallengeSkeleton />
  }

  if (error) {
    return <RecommendedChallengeError />
  }

  if (!recommendedChallenge) {
    return <RecommendedChallengeNotFound />
  }

  return (
    <RecommendedChallengeCard>
      <RecommendedChallengeCard.LeftSide>
        <RecommendedChallengeCard.HeaderTitle>
          Here&apos;s a challenge for you:
        </RecommendedChallengeCard.HeaderTitle>
        {isFetching && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Updating...
          </div>
        )}
        <RecommendedChallengeCard.Header>
          <RecommendedChallengeTitle title={recommendedChallenge.title} />
          {recommendedChallenge.difficulty && (
            <ChallengeDifficultyBadge difficulty={recommendedChallenge.difficulty as any} />
          )}
        </RecommendedChallengeCard.Header>
        <RecommendedChallengeCard.Description>
          <RecommendedChallengeDescription>
            <Trophy className="h-4 w-4" />
            <RecommendedChallengeExperience
              baseExperience={recommendedChallenge.baseExperience || 0}
            />
          </RecommendedChallengeDescription>
        </RecommendedChallengeCard.Description>
      </RecommendedChallengeCard.LeftSide>
      <RecommendedChallengeCard.RightSide>
        <LinkButton href={`/challenges/${recommendedChallenge.slug}`}>Start Challenge</LinkButton>
      </RecommendedChallengeCard.RightSide>
    </RecommendedChallengeCard>
  )
}
