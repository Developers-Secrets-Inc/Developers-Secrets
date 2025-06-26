import { fetchUserQuests } from '@/core/gamification/quests/actions'
import { NewChallengeSuccessDialog } from './new-completion-dialog.client'
import { getChallengeById } from '@/core/challenges/challenge-queries'

export const NewCompletionDialog = async ({
  userId,
  challengeId,
}: {
  userId: string
  challengeId: number
}) => {
  const userQuests = await fetchUserQuests()
  const challenge = await getChallengeById(challengeId)
  const xp = challenge?.baseExperience ?? 50
  // TODO: Remplacer '1:24' par la vraie logique de calcul du temps passé si disponible
  const timeSpent = '1:24'

  return (
    <NewChallengeSuccessDialog
      quests={userQuests}
      challengeId={challengeId}
      userId={userId}
      xp={xp}
      timeSpent={timeSpent}
    />
  )
}
