'use client'

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { Quest, UserQuest as PayloadUserQuest } from '@/payload-types'
import { Award, RefreshCw } from 'lucide-react'
import { useMemo } from 'react'
import { QuestCard } from './quest-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuests, useQuestActions, useQuestReplacementInfo } from '../hooks/use-quests'

// Extend PayloadUserQuest to ensure we have all required fields
interface UserQuest extends PayloadUserQuest {
  quest: Quest
  currentProgression: number
  isCompleted: boolean
}

const QuestSkeleton = () => {
  return (
    <div className="border-input relative flex w-full items-start gap-4 rounded-md border p-4 shadow-xs outline-none">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-1.5 w-full" />
      </div>
    </div>
  )
}

export const QuestsDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  // Fetch quests and replacement info
  const { data: activeQuests, isLoading: isLoadingQuests, error: questsError } = useQuests()
  const {
    data: replacementInfo,
    isLoading: isLoadingInfo,
    error: infoError,
  } = useQuestReplacementInfo()
  const { completeQuest, replaceQuest, invalidateQuests, isReplacingQuestId } = useQuestActions()

  // Combine loading states
  const isLoading = isLoadingQuests || isLoadingInfo

  // Calculate remaining replacements
  const remainingReplacements = useMemo(() => {
    if (!replacementInfo || replacementInfo.maxReplacements === Infinity) {
      return Infinity
    }
    return Math.max(0, replacementInfo.maxReplacements - replacementInfo.replacementsUsed)
  }, [replacementInfo])

  // Mémoiser les quêtes triées
  const sortedQuests = useMemo(() => {
    if (!activeQuests) return []

    return [...activeQuests].sort((a, b) => {
      // Trier d'abord par statut de complétion (non complétées en premier)
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1
      }
      // Puis par difficulté
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
      return difficultyOrder[a.quest.difficulty] - difficultyOrder[b.quest.difficulty]
    })
  }, [activeQuests])

  // Mémoiser le contenu des quêtes
  const questContent = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => <QuestSkeleton key={index} />)
    }

    if (questsError || infoError) {
      return <div className="text-center text-red-500">Failed to load quest data</div>
    }

    if (sortedQuests.length === 0) {
      return <div className="text-center text-muted-foreground">No quests available</div>
    }

    return sortedQuests.map((userQuest) => {
      const questId = typeof userQuest.quest === 'number' ? userQuest.quest : userQuest.quest?.id
      const canReplaceQuest = !userQuest.isCompleted && remainingReplacements > 0
      const isCurrentQuestReplacing = !!questId && isReplacingQuestId === questId.toString()

      return (
        <QuestCard
          key={userQuest.id}
          userQuest={userQuest}
          onReplaceQuest={() => {
            if (questId) {
              replaceQuest(questId.toString())
            } else {
              console.error('Cannot replace quest: Quest ID is missing.')
            }
          }}
          canReplace={canReplaceQuest && !isReplacingQuestId}
          isReplacing={isCurrentQuestReplacing}
          onCompleteQuest={() => {
            if (questId) {
              completeQuest(questId.toString())
            } else {
              console.error('Cannot complete quest: Quest ID is missing.')
            }
          }}
        />
      )
    })
  }, [
    isLoading,
    questsError,
    infoError,
    sortedQuests,
    remainingReplacements,
    completeQuest,
    replaceQuest,
    invalidateQuests,
    isReplacingQuestId,
  ])

  // Display remaining replacements
  const replacementText = useMemo(() => {
    if (isLoading || !replacementInfo) return 'Loading...'
    if (remainingReplacements === Infinity) return 'Unlimited replacements left'
    return `${remainingReplacements} replacement${remainingReplacements !== 1 ? 's' : ''} left today`
  }, [isLoading, replacementInfo, remainingReplacements])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-amber-500" />
            Available Quests
          </DialogTitle>
          <DialogDescription>
            Complete quests for XP and chests. Replace quests you don't like.
            <span className="block text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              {replacementText}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">{questContent}</div>
      </DialogContent>
    </Dialog>
  )
}
