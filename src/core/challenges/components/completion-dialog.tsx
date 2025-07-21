import { getChallengeCompletionData } from '../actions'
import { CompletionDialog as CompletionDialogClient } from './completion-dialog.client'

export const CompletionDialog = async ({
  userId,
  challenge,
}: {
  userId: string
  challenge: {
    id: number
    slug: string
  }
}) => {
  const data = await getChallengeCompletionData(userId, challenge.id, challenge.slug)

  return (
    <CompletionDialogClient
      experienceGained={data.challengeExperience}
      currentLevel={data.gamificationInfo.currentLevel}
      currentExperience={data.gamificationInfo.currentExperience}
      nextLevelExperience={data.gamificationInfo.nextLevelExperience}
      nextChallengeUrl={data.nextChallengeUrl}
      hasUnlockedSolution={data.wasUnlocked}
    />
  )
}
