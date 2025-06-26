'use client'

import { Braces, Timer } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useChallengeEditorStore } from '@/core/compiler/challenge-editor/store'
import { useChallengeSubmissions } from '@/core/challenges/submissions/hooks/use-challenge-submissions'

import { Badge } from '@/components/ui/badge'
import { useSessionUser } from '@/core/user/hooks/use-user'
import { Zap } from 'lucide-react'
import { DialogPage, MultiPageDialog } from '@/components/multi-pages-dialog'
import { Quest } from '@/payload-types'
import { QuestCard } from '@/core/gamification/quests/components/quest-card'
import { UserQuest as PayloadUserQuest } from '@/payload-types'
import { useQuests } from '@/core/gamification/quests/hooks/use-quests'

// Ajout de framer-motion pour l'animation
import { useMotionValue, animate, motion } from 'framer-motion'

const AnimatedNumber = ({
  value,
  className,
  animate: shouldAnimate,
}: {
  value: number
  className: string
  animate: boolean
}) => {
  const motionValue = useMotionValue(0)
  const [displayed, setDisplayed] = React.useState(0)

  useEffect(() => {
    if (!shouldAnimate) return
    const controls = animate(motionValue, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayed(Math.round(latest))
      },
      onComplete: () => {
        setDisplayed(value)
      },
    })
    return controls.stop
  }, [value, shouldAnimate, motionValue])

  return <span className={className}>{displayed}</span>
}

const AnimatedDate = ({
  value,
  className,
  animate: shouldAnimate,
}: {
  value: string
  className: string
  animate: boolean
}) => {
  const [displayed, setDisplayed] = React.useState('')

  useEffect(() => {
    if (!shouldAnimate) return
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= value.length) {
        setDisplayed(value.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [value, shouldAnimate])

  return <span className={className}>{displayed}</span>
}

const CompletedChallengeExperience = ({
  experience,
  comment,
  animate,
}: {
  experience: number
  comment?: string
  animate: boolean
}) => {
  return (
    <CompletedChallengeInformationCard>
      <span className="font-medium">Challenge XP</span>
      <div className="flex items-center gap-1">
        <Zap className="text-yellow-500" size={16} aria-label="XP" />
        <AnimatedNumber
          className="text-yellow-500 font-medium"
          value={experience}
          animate={animate}
        />
      </div>
      {comment && (
        <div className="bg-background absolute top-[-18px] -right-0">
          <Badge
            variant="outline"
            className="gap-1.5 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 uppercase"
          >
            {comment}
          </Badge>
        </div>
      )}
    </CompletedChallengeInformationCard>
  )
}

const CompletedChallengeSubmissionsCount = ({
  submissions,
  animate,
}: {
  submissions: number
  animate: boolean
}) => {
  return (
    <CompletedChallengeInformationCard>
      <span className="font-medium">Total Submissions</span>
      <div className="flex items-center gap-1">
        <Braces className="text-red-400" size={16} aria-label="XP" />
        <AnimatedNumber
          className="text-red-400 font-medium"
          value={submissions}
          animate={animate}
        />
      </div>
      <div className="bg-background absolute top-[-18px] -right-0">
        <Badge
          variant="outline"
          className="gap-1.5 bg-red-400/10 text-red-400 border-red-400/20 uppercase"
        >
          Bravo&nbsp;!
        </Badge>
      </div>
    </CompletedChallengeInformationCard>
  )
}

const CompletedChallengeTimeSpent = ({ time, animate }: { time: string; animate: boolean }) => {
  return (
    <CompletedChallengeInformationCard>
      <span className="font-medium">Time Spent</span>
      <div className="flex items-center gap-1">
        <Timer className="text-blue-400" size={16} aria-label="XP" />
        <AnimatedDate className="text-blue-400 font-medium" value={time} animate={animate} />
      </div>
      <div className="bg-background absolute top-[-18px] -right-0">
        <Badge
          variant="outline"
          className="gap-1.5 bg-blue-400/10 text-blue-400 border-blue-400/20 uppercase"
        >
          Super rapide
        </Badge>
      </div>
    </CompletedChallengeInformationCard>
  )
}

const CompletedChallengeInformationCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative border border-border flex justify-between items-center p-3 rounded-md w-sm shadow-md">
      {children}
    </div>
  )
}

////////////////////

export const ChallengeCompletionInformations = ({
  challengeId,
  userId,
  xp,
  timeSpent,
}: {
  challengeId: number
  userId: string
  xp: number
  timeSpent: string
}) => {
  const { paginationData, isLoading } = useChallengeSubmissions(Number(challengeId))
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)
  const submissionsCount = paginationData?.docs?.length ?? 0

  if (isLoading) return <div>Loading...</div>

  const cards = [
    {
      key: 'xp',
      render: (animate: boolean) => (
        <CompletedChallengeExperience experience={xp} comment="Streak bonus" animate={animate} />
      ),
    },
    {
      key: 'submissions',
      render: (animate: boolean) => (
        <CompletedChallengeSubmissionsCount submissions={submissionsCount} animate={animate} />
      ),
    },
    {
      key: 'time',
      render: (animate: boolean) => (
        <CompletedChallengeTimeSpent time={timeSpent} animate={animate} />
      ),
    },
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 30 }}
          animate={idx <= visibleCardIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0 }}
          onAnimationComplete={() => {
            if (idx === visibleCardIndex && visibleCardIndex < cards.length - 1) {
              setTimeout(() => setVisibleCardIndex(visibleCardIndex + 1), 400)
            }
          }}
          style={{ pointerEvents: idx === visibleCardIndex ? 'auto' : 'none' }}
        >
          {card.render(idx === visibleCardIndex)}
        </motion.div>
      ))}
    </div>
  )
}

type UserQuest = PayloadUserQuest & {
  quest: Quest
  currentProgression: number
  isCompleted: boolean
}

const QuestsProgressionPage = ({ quests }: { quests: UserQuest[] }) => {
  const [visibleQuestIndex, setVisibleQuestIndex] = useState(0)

  return (
    <div className="flex flex-col gap-2">
      {quests.map((quest: UserQuest, idx) => (
        <motion.div
          key={quest.id}
          initial={{ opacity: 0, y: 30 }}
          animate={idx <= visibleQuestIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.4, delay: 0 }}
          onAnimationComplete={() => {
            if (idx === visibleQuestIndex && visibleQuestIndex < quests.length - 1) {
              setTimeout(() => setVisibleQuestIndex(visibleQuestIndex + 1), 100)
            }
          }}
          style={{ pointerEvents: idx === visibleQuestIndex ? 'auto' : 'none' }}
        >
          <QuestCard userQuest={quest} />
        </motion.div>
      ))}
    </div>
  )
}

export function NewChallengeSuccessDialog({
  quests,
  challengeId,
  userId,
  xp,
  timeSpent,
}: {
  quests: UserQuest[]
  challengeId: number
  userId: string
  xp: number
  timeSpent: string
}) {
  const { showCompletionDialog, closeCompletionDialog } = useChallengeEditorStore()

  const pages: DialogPage[] = [
    {
      title: 'Challenge Completed',
      cta: 'Get My Experience',
      content: (
        <ChallengeCompletionInformations
          challengeId={challengeId}
          userId={userId}
          xp={xp}
          timeSpent={timeSpent}
        />
      ),
    },
    {
      title: 'Your Daily Quests',
      cta: 'Get My Rewards',
      content: <QuestsProgressionPage quests={quests} />,
    },
  ]

  return (
    <MultiPageDialog
      open={showCompletionDialog}
      onOpenChange={closeCompletionDialog}
      pages={pages}
    />
  )
}
