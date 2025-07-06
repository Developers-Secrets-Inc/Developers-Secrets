import { NewChallengeSuccessDialog } from './new-completion-dialog.client'
import { getChallengeById } from '@/core/challenges/challenge-queries'
import { getGamificationInformations, getUserNextLevelExperience } from '@/core/gamification/level'
import { UserGamification } from '@/payload-types'

export const NewCompletionDialog = async ({
  userId,
  challengeId,
}: {
  userId: string
  challengeId: number
}) => {
  const challenge = await getChallengeById(challengeId)
  const xp = challenge?.baseExperience ?? 50

  const initialUserLevelInfo = await getGamificationInformations(userId)
  const experienceForNextLevel = await getUserNextLevelExperience(userId)

  return (
    <NewChallengeSuccessDialog
      challengeId={challengeId}
      userId={userId}
      xp={xp}
    />
  )
}
