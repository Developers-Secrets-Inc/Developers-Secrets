'use client'

import { useChallengeEditorStore } from '@/core/compiler/challenge-editor/store'

import { DialogPage, MultiPageDialog } from '@/components/multi-pages-dialog'
import { useQuests } from '@/core/gamification/quests/hooks/use-quests'
import { Loader2 } from 'lucide-react'
import { useChallengeTimer } from '../../hooks/use-challenge-timer'

import { UserGamification } from '@/payload-types'
import {
  ChallengeCompletionInformations,
  LevelPage,
  QuestsProgressionPage,
  StreakProgressionPage,
} from './pages'

export function NewChallengeSuccessDialog({
  challengeId,
  userId,
  xp,
  initialUserLevelInfo,
  experienceForNextLevel,
}: {
  challengeId: number
  userId: string
  xp: number
  initialUserLevelInfo?: UserGamification | null
  experienceForNextLevel?: number
}) {
  const { showCompletionDialog, closeCompletionDialog } = useChallengeEditorStore()
  const { data: quests } = useQuests()
  const { stopTimer } = useChallengeTimer(challengeId)

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      stopTimer()
    }
    closeCompletionDialog()
  }

  const initialInfo = {
    level: 1,
    currentXp: 0,
    xpForNextLevel: 100,
  }

  const pages: DialogPage[] = [
    {
      title: 'Challenge Completed',
      cta: 'My Rewards',
      content: <ChallengeCompletionInformations challengeId={challengeId} userId={userId} />,
    },
    {
      title: 'Your Level',
      cta: 'Continue',
      content: <LevelPage initialInfo={initialInfo} xpGained={xp} />,
    },
    {
      title: 'Your Daily Quests',
      cta: 'My Rewards',
      content: <QuestsProgressionPage quests={quests} />,
    },
    {
      title: 'Your Streak',
      cta: 'Finish',
      content: (
        <StreakProgressionPage
          streak={1}
          challengesPerDay={[1, 5, 0, 3, 1, 0, 0]}
          currentDayIndex={new Date().getDay()}
        />
      ),
    },
  ]

  return (
    <MultiPageDialog open={showCompletionDialog} onOpenChange={handleOpenChange} pages={pages} />
  )
}
