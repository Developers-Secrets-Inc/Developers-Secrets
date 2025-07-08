'use client'

import { Braces, Timer } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useChallengeSubmissions } from '@/core/challenges/submissions/hooks/use-challenge-submissions'
import { useChallengeEditorStore } from '@/core/compiler/challenge-editor/store'

import { Badge } from '@/components/ui/badge'
import { useChallengeTimer } from '@/core/challenges/hooks/use-challenge-timer'

// Ajout de framer-motion pour l'animation
import { animate, motion, useMotionValue } from 'framer-motion'

// Imports nécessaires pour le Tooltip
import { CoinIcon } from '@/components/icons/coin'
import { useChallengeStore } from '@/core/challenges/store'

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

const CompletedChallengeInformationCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative border border-border flex justify-between items-center p-3 rounded-md w-sm shadow-md">
      {children}
    </div>
  )
}

const CompletedChallengeCoins = ({
  coins,
  comment,
  animate,
}: {
  coins: number
  comment?: string
  animate: boolean
}) => {
  return (
    <CompletedChallengeInformationCard>
      <span className="font-medium">Coins Earned</span>
      <div className="flex items-center gap-1">
        <CoinIcon
          className="text-yellow-500"
          style={{ width: 16, height: 16 }}
          aria-label="Coins"
        />
        <AnimatedNumber className="text-yellow-500 font-medium" value={coins} animate={animate} />
      </div>
      {comment && (
        <CommentBadge
          comment={comment}
          className="gap-1.5 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 uppercase"
        />
      )}
    </CompletedChallengeInformationCard>
  )
}

const CompletedChallengeSubmissionsCount = ({
  submissions,
  animate,
  comment,
}: {
  submissions: number
  animate: boolean
  comment?: string
}) => {
  const comments: Record<number, string> = {
    0: 'Are you a genius?',
    1: 'Is this possible??',
    3: 'Incredible!',
  }

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
      {(comment || comments[submissions]) && (
          <CommentBadge
            comment={comment || comments[submissions]}
            className="gap-1.5 bg-red-400/10 text-red-400 border-red-400/20 uppercase"
          />
      )}
    </CompletedChallengeInformationCard>
  )
}

const CommentBadge = ({
  comment,
  ...badgeProps
}: { comment: string } & React.ComponentProps<typeof Badge>) => {
  return (
    <div className="bg-background absolute top-[-18px] -right-0">
      <Badge variant="outline" {...badgeProps}>
        {comment}
      </Badge>
    </div>
  )
}

const CompletedChallengeTimeSpent = ({
  time,
  animate,
  comment,
}: {
  time: string
  animate: boolean
  comment?: string
}) => {
  return (
    <CompletedChallengeInformationCard>
      <span className="font-medium">Time Spent</span>
      <div className="flex items-center gap-1 ">
        <Timer className="text-blue-400" size={16} aria-label="XP" />
        <AnimatedDate className="text-blue-400 font-medium" value={time} animate={animate} />
      </div>
      {comment && (
        <CommentBadge
          comment={comment}
          className="gap-1.5 bg-blue-400/10 text-blue-400 border-blue-400/20 uppercase"
        />
      )}
    </CompletedChallengeInformationCard>
  )
}

const PureChallengeCompletionInformation = ({
  cards,
}: {
  cards: {
    key: string
    render: (animate: boolean) => React.ReactNode
  }[]
}) => {
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)

  return (
    <div className="flex flex-col items-center gap-6 py-4">
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

export const ChallengeCompletionInformations = ({
  challengeId,
  userId,
}: {
  challengeId: number
  userId: string
}) => {
  const { paginationData, isLoading } = useChallengeSubmissions(challengeId)
  const { getTimeSpent } = useChallengeTimer(challengeId)
  const { showCompletionDialog } = useChallengeEditorStore()
  const submissionsCount = paginationData?.docs?.length ?? 0
  const [timeSpent, setTimeSpent] = useState('00:00:00')
  const { currencyOnCompletion, challenge } = useChallengeStore()

  const isLucky = currencyOnCompletion >= (challenge?.baseExperience ?? 0) * 0.8
  const isUnlucky = currencyOnCompletion <= (challenge?.baseExperience ?? 0) * 0.2

  useEffect(() => {
    if (showCompletionDialog) {
      const time = getTimeSpent()
      if (time) {
        setTimeSpent(time.formatted)
      }
    }
  }, [showCompletionDialog, getTimeSpent])

  if (isLoading) return <div>Loading...</div>
 

  const cards = [
    {
      key: 'coins',
      render: (animate: boolean) => (
        <CompletedChallengeCoins coins={currencyOnCompletion} animate={animate} comment={isLucky ? 'Feeling lucky!' : isUnlucky ? 'Feeling unlucky...' : undefined} />
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

  return <PureChallengeCompletionInformation cards={cards} />
}


/* 

- Coins -> random value based on the difficulty (TODO: Add boosts support)
- Submissions -> count of submissions (hook)
- Time -> time spent (hook)

*/