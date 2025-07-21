import { preloadQuery } from '@/core/functions/preload'
import { findUserChallengeEngagement } from '../engagement'
import { EngagementButtons as EngagementButtonsClient } from './engagement-buttons.client'

interface EngagementButtonsProps {
  userId: string
  challengeId: number
}

export async function EngagementButtons({ userId, challengeId }: EngagementButtonsProps) {
  const preloaded = await preloadQuery(findUserChallengeEngagement, { userId, challengeId })
  return (
    <EngagementButtonsClient userId={userId} challengeId={challengeId} preloaded={preloaded} />
  )
}
