import { DialogPage } from '@/components/multi-pages-dialog'
import { NewChallengeSuccessDialog } from './new-completion-dialog.client'
import { getChallengeById } from '@/core/challenges/challenge-queries'
import { getGamificationInformations } from '@/core/gamification/level'
import { getWeeklyChallengeStreak } from '@/core/gamification/streaks/challenges'
import { LevelPage } from './pages/level-page'
import { QuestsProgressionPage } from './pages/quests-progression-page'
import { StreakProgressionPage } from './pages/streak-progression-page'
import { getSessionUserQuests } from '@/core/gamification/quests/actions'
import { ChallengeCompletionInformations } from './pages/completion-informations-page'

export const NewCompletionDialog = async ({
  userId,
  challengeId,
}: {
  userId: string
  challengeId: number
}) => {
  const challenge = await getChallengeById(challengeId)
  const xpGained = challenge?.baseExperience ?? 50

  const initialUserLevelInfo = await getGamificationInformations(userId)

  const gamificationInformations = {
    level: initialUserLevelInfo.currentLevel,
    currentXp: initialUserLevelInfo.currentExperience,
    xpGained: xpGained,
  }

  const streaks = await getWeeklyChallengeStreak(userId).then((streaks) => {
    const today = new Date().getDay()

    return {
      streak: streaks.currentStreak + 1,
      challengesPerDay: streaks.challengesPerDay.map((day, index) => index === today ? day + 1 : day),
    }
  })

  const quests = await getSessionUserQuests()




  const pages: DialogPage[] = [
    {
      title: 'Challenge Completed',
      cta: 'My Rewards',
      content: <ChallengeCompletionInformations challengeId={challengeId} userId={userId} />,
    },
    {
      title: 'Your Level',
      cta: 'Continue',
      content: <LevelPage initialInfo={gamificationInformations}/>,
    },
    {
      title: 'Your Daily Quests',
      cta: 'My Rewards',
      content: <QuestsProgressionPage quests={quests} />,
    },
    ...(streaks.streak in [1, 3, 5] ? [{
      title: 'Your Streak',
      cta: 'Finish',  
      content: (
        <StreakProgressionPage
          streak={streaks.streak}
          challengesPerDay={streaks.challengesPerDay}
          currentDayIndex={new Date().getDay()}
        />
      ),
    }] : []),
  ]

  return (
    <NewChallengeSuccessDialog
      challengeId={challengeId}
      pages={pages}
    />
  )
}
