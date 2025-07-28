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
import { Challenge } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getNextChallenge } from '@/api/challenges/navigation'
import { isNone, isSome } from '@/lib/maybe'

export const NewCompletionDialog = async ({
  userId,
  challenge,
}: {
  userId: string
  challenge: Challenge
}) => {
  const xpGained = challenge.baseExperience ?? 50

  const initialUserLevelInfo = await getGamificationInformations(userId)
  const nextChallenge = await getNextChallenge({ challengeId: challenge.id })

  const gamificationInformations = {
    level: initialUserLevelInfo.currentLevel,
    currentXp: initialUserLevelInfo.currentExperience,
    xpGained: xpGained,
  }

  const streaks = await getWeeklyChallengeStreak(userId).then((streaks) => {
    const today = new Date().getDay()

    return {
      streak: streaks.currentStreak + 1,
      challengesPerDay: streaks.challengesPerDay.map((day, index) =>
        index === today ? day + 1 : day,
      ),
    }
  })

  const quests = await getSessionUserQuests()

  const pages: DialogPage[] = [
    {
      title: 'Challenge Completed',
      cta: 'My Rewards',
      content: <ChallengeCompletionInformations challengeId={challenge.id} userId={userId} />,
    },
    {
      title: 'Your Level',
      cta: 'Continue',
      content: <LevelPage initialInfo={gamificationInformations} />,
    },
    {
      title: 'Your Daily Quests',
      cta: streaks.streak in [1, 3, 5] ? 'My Rewards' : <Button>Hey</Button>,
      content: <QuestsProgressionPage quests={quests} />,
    },
    ...(streaks.streak in [1, 3, 5]
      ? [
          {
            title: 'Your Streak',
            cta: (
              <>
                <Button className="w-full" variant={'outline'} asChild>
                  <Link href="/challenges">Back to challenges</Link>
                </Button>
                {isSome(nextChallenge) && (
                  <Button className="w-full" asChild>
                    <Link href={`/challenges/${nextChallenge.value.slug}/description`}>Next Challenge</Link>
                  </Button>
                )}
              </>
            ),
            content: (
              <StreakProgressionPage
                streak={streaks.streak}
                challengesPerDay={streaks.challengesPerDay}
                currentDayIndex={new Date().getDay()}
              />
            ),
          },
        ]
      : []),
  ]

  return <NewChallengeSuccessDialog challengeId={challenge.id} pages={pages} />
}
