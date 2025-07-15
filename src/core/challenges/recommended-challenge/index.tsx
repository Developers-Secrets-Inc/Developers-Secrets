import { LinkButton } from '@/components/common/link-button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { ChallengeDifficultyBadge } from './difficulty-badge'
import { Trophy } from 'lucide-react'
import { getRandomUncompletedChallenge } from '@/api/challenges'
import { Skeleton } from '@/components/ui/skeleton'
import { RecommendedChallengeClient } from './recommended-challenge.client'

export const RecommendedChallengeCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="w-full py-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
        {children}
      </div>
    </Card>
  )
}

export const RecommendedChallengeCardLeftSide = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 mr-6">{children}</div>
}

export const RecommendedChallengeCardRightSide = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col items-end gap-3 flex-shrink-0 mt-4 md:mt-0">{children}</div>
}

export const RecommendedChallengeCardHeaderTitle = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="mb-2 text-sm font-medium text-primary">{children}</div>
}

export const RecommendedChallengeCardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2 mb-1.5 flex-wrap">{children}</div>
}

export const RecommendedChallengeTitle = ({ title }: { title: string }) => {
  return <CardTitle className="text-xl">{title}</CardTitle>
}

export const RecommendedChallengeCardDescription = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="flex items-center gap-4 flex-wrap">{children}</div>
}

export const RecommendedChallengeDescription = ({ children }: { children: React.ReactNode }) => {
  return <CardDescription className="flex flex-wrap gap-2">{children}</CardDescription>
}

export const RecommendedChallengeExperience = ({ baseExperience }: { baseExperience: number }) => {
  return <span>{baseExperience || '?'} XP</span>
}

RecommendedChallengeCard.LeftSide = RecommendedChallengeCardLeftSide
RecommendedChallengeCard.RightSide = RecommendedChallengeCardRightSide
RecommendedChallengeCard.HeaderTitle = RecommendedChallengeCardHeaderTitle
RecommendedChallengeCard.Header = RecommendedChallengeCardHeader
RecommendedChallengeCard.Description = RecommendedChallengeCardDescription

export const RecommendedChallenge = async ({ userId }: { userId: string }) => {
  const initialChallenge = await getRandomUncompletedChallenge(userId)


  
  return <RecommendedChallengeClient userId={userId} initialChallenge={initialChallenge} />
}

export const RecommendedChallengeSkeleton = () => {
  return (
    <RecommendedChallengeCard>
      <RecommendedChallengeCard.LeftSide>
        <RecommendedChallengeCard.HeaderTitle>
          <Skeleton className="h-4 w-3/4" />
        </RecommendedChallengeCard.HeaderTitle>
        <RecommendedChallengeCard.Header>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
        </RecommendedChallengeCard.Header>
        <RecommendedChallengeCard.Description>
          <RecommendedChallengeDescription>
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-1/6" />
          </RecommendedChallengeDescription>
        </RecommendedChallengeCard.Description>
      </RecommendedChallengeCard.LeftSide>
      <RecommendedChallengeCard.RightSide>
        <Skeleton className="h-10 w-32" />
      </RecommendedChallengeCard.RightSide>
    </RecommendedChallengeCard>
  )
}
