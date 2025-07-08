'use client'

import React from 'react'


import { CheckCircle2, CircleDashed } from 'lucide-react'

import { cn } from '@/lib/utils'

import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'




type DayStyle = {
  containerClasses: string
  icon: React.ElementType
}

// Logique de style centralisée
const getDayStyle = (challengeCount: number): DayStyle => {
  if (challengeCount >= 5) {
    return {
      containerClasses: 'bg-amber-500/15 text-amber-500 ring-amber-500/20',
      icon: CheckCircle2,
    }
  }
  if (challengeCount >= 3) {
    return {
      containerClasses: 'bg-yellow-500/15 text-yellow-500 ring-yellow-500/20',
      icon: CheckCircle2,
    }
  }
  if (challengeCount >= 1) {
    return {
      containerClasses: 'bg-emerald-500/15 text-emerald-500 ring-emerald-500/20',
      icon: CheckCircle2,
    }
  }
  return {
    containerClasses: 'bg-muted ring-border text-muted-foreground/50',
    icon: CircleDashed,
  }
}

// Une fonction 'helper' pour obtenir les classes de style en fonction du nombre de challenges
const getDayContainerStyle = (challengeCount: number): string => {
  if (challengeCount >= 5) {
    // Orange/Or
    return 'bg-amber-500/15 text-amber-500 ring-amber-500/20'
  }
  if (challengeCount >= 3) {
    // Jaune - le bleu a été remplacé ici
    return 'bg-yellow-500/15 text-yellow-500 ring-yellow-500/20'
  }
  if (challengeCount >= 1) {
    // Vert
    return 'bg-emerald-500/15 text-emerald-500 ring-emerald-500/20'
  }
  // Gris
  return 'bg-muted ring-border'
}

export const StreakProgressionPage = ({
  streak,
  challengesPerDay,
  currentDayIndex,
}: {
  streak: number
  challengesPerDay: number[] // Ex: [1, 5, 0, 3, 2, 0, 0]
  currentDayIndex: number
}) => {
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  // Helper pour générer le texte du tooltip
  const getTooltipText = (count: number): string => {
    if (count === 0) return 'No challenges completed'
    if (count === 1) return '1 challenge completed'
    return `${count} challenges completed`
  }

  return (
    // Le TooltipProvider est nécessaire pour que les tooltips fonctionnent
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <div className="text-7xl font-bold text-primary">{streak}</div>
        <h3 className="text-xl font-medium text-muted-foreground mt-2">Day Streak</h3>
        <p className="text-sm text-muted-foreground mt-6 mb-8">
          Complete a challenge every day to keep the fire going!
        </p>

        <div className="flex items-center justify-center space-x-3">
          {dayLabels.map((label, i) => {
            const challengeCount = challengesPerDay[i] ?? 0
            const { containerClasses, icon: Icon } = getDayStyle(challengeCount)
            const isInactive = challengeCount === 0
            const isCurrentDay = i === currentDayIndex

            return (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center space-y-2 cursor-default">
                    <div
                      className={cn(
                        'rounded-full ring-1 ring-inset transition-all',
                        'flex h-11 w-11 items-center justify-center',
                        containerClasses,
                      )}
                    >
                      <Icon className={cn('h-6 w-6', isInactive && 'text-muted-foreground/50')} />
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium transition-colors',
                        isInactive ? 'text-muted-foreground/60' : 'text-foreground',
                        isCurrentDay && 'text-primary',
                      )}
                    >
                      {label}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContentCustom>
                  <p>{getTooltipText(challengeCount)}</p>
                </TooltipContentCustom>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}