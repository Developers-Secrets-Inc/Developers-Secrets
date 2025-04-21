'use client'

import { useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  useCompletedChallenges,
  CompletedChallengeInfo,
} from '@/core/challenges/user-progression/hooks/use-completed-challenges'

// --- Props pour le composant ---
interface CalendarDayButtonProps {
  day: number | null // Le numéro du jour (1-31) ou null si placeholder
  date: string | null // La date complète "YYYY-MM-DD" ou null
  completedChallengesCount: number // Le nombre pour le style et le tooltip
  isPlaceholder: boolean // Est-ce une case vide ?
  userId: string // Nécessaire pour récupérer les détails
}

// Fonction helper pour le style du badge de difficulté (peut être partagée/importée)
const getDifficultyBadgeClass = (difficulty: CompletedChallengeInfo['difficulty']): string => {
  switch (difficulty) {
    case 'easy':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'medium':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'hard':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'horrible':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    default:
      return ''
  }
}

// --- Composant interne pour le contenu du dialogue (utilise le hook importé) ---
function DialogChallengeList({ userId, date }: { userId: string; date: string }) {
  // Utilisation du hook personnalisé importé
  const { challenges, isLoading, error } = useCompletedChallenges(userId, date)

  if (isLoading) {
    // Squelette simple pour la liste
    return (
      <div className="space-y-2 py-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (error) {
    return <p className="py-4 text-sm text-destructive">{error}</p>
  }

  return (
    <div className="py-4 space-y-3">
      {challenges.length > 0 ? (
        challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="p-3 border rounded-md flex items-center justify-between gap-3"
          >
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <p className="font-medium truncate text-sm" title={challenge.title}>
                {challenge.title}
              </p>
              <Badge
                variant="secondary"
                className={cn(
                  'capitalize text-xs px-1.5 py-0.5 font-medium border whitespace-nowrap',
                  getDifficultyBadgeClass(challenge.difficulty),
                )}
              >
                {challenge.difficulty}
              </Badge>
            </div>
            <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
              <Link href={`/challenges/${challenge.slug}`}>View</Link>
            </Button>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No challenges completed on this day.</p>
      )}
    </div>
  )
}

// --- Composant principal du bouton/cellule du calendrier ---
export function CalendarDayButton({
  day,
  date,
  completedChallengesCount,
  isPlaceholder,
  userId,
}: CalendarDayButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Ne rien rendre pour les placeholders (maintenir la grille)
  if (isPlaceholder || !date) {
    return <div className="h-7 w-7 invisible" aria-hidden="true" />
  }

  const hasCompleted = completedChallengesCount > 0

  // Contenu cliquable qui déclenche le dialogue
  const triggerContent = (
    <div
      className={cn(
        `h-7 w-7 rounded flex items-center justify-center text-xs border cursor-pointer transition-colors`,
        hasCompleted
          ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
          : 'bg-muted/10 text-muted-foreground border-muted/20 hover:bg-muted/20',
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setIsOpen(true)
      }}
    >
      {day}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <DialogTrigger asChild>{triggerContent}</DialogTrigger>
          </Tooltip.Trigger>
          <TooltipContentCustom sideOffset={4}>
            {completedChallengesCount} challenge
            {completedChallengesCount !== 1 ? 's' : ''} completed on {date}
          </TooltipContentCustom>
        </Tooltip.Root>
      </Tooltip.Provider>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Completed on {date}</DialogTitle>
          <DialogDescription>Challenges you successfully completed on this day.</DialogDescription>
        </DialogHeader>
        {/* Le dialogue ne rend son contenu que lorsqu'il est ouvert */}
        {/* DialogChallengeList gère son propre chargement/erreur via le hook */}
        {isOpen && <DialogChallengeList userId={userId} date={date} />}
      </DialogContent>
    </Dialog>
  )
}
