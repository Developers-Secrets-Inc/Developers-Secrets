'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Award, RefreshCw } from 'lucide-react'
import { useMemo } from 'react'
import { useQuestActions, useQuestReplacementInfo, useQuests } from '../hooks/use-quests'
import { QuestCard } from './quest-card'
import { UserQuest } from '@/payload-types'
import { Quest } from '@/payload-types'


const getSortedQuests = (quests: UserQuest[]): UserQuest[] => {
  return [...quests].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1
    }
    const difficultyOrder: Record<Quest['difficulty'], number> = { easy: 1, medium: 2, hard: 3 }
    return difficultyOrder[(a.quest as Quest).difficulty] - difficultyOrder[(b.quest as Quest).difficulty]
  })
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

const PureQuestsDialog = ({
  isOpen,
  onOpenChange,
  children,
  replacementText,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  replacementText: string
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-amber-500" />
            Available Quests
          </DialogTitle>
          <DialogDescription>
            Complete quests for XP and chests. Replace quests you don&apos;t like.
            <span className="block text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              {replacementText}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">{children}</div>
      </DialogContent>
    </Dialog>
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

  // Memoize the sorted quests
  const sortedQuests = useMemo(() => {
    if (!activeQuests) return []
    return getSortedQuests(activeQuests)
  }, [activeQuests])

  // Memoize the quest content
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
        // <QuestCard
        //   key={userQuest.id}
        //   userQuest={userQuest}
        //   onReplaceQuest={() => {
        //     if (questId) {
        //       replaceQuest(questId.toString())
        //     } else {
        //       console.error('Cannot replace quest: Quest ID is missing.')
        //     }
        //   }}
        //   canReplace={canReplaceQuest && !isReplacingQuestId}
        //   isReplacing={isCurrentQuestReplacing}
        //   onCompleteQuest={() => {
        //     if (questId) {
        //       completeQuest(questId)
        //     } else {
        //       console.error('Cannot complete quest: Quest ID is missing.')
        //     }
        //   }}
        // />
        <QuestCard.Root key={userQuest.id} userQuest={userQuest}>
          <QuestCard.Icon />
          <QuestCard.Container>
            <QuestCard.Header>
              <div className="flex items-center gap-2">
                <QuestCard.Title />
              </div>
              <QuestCard.Reward />
            </QuestCard.Header>
            <QuestCard.Progression />
          </QuestCard.Container>
        </QuestCard.Root>
      )
    })
  }, [
    isLoading,
    questsError,
    infoError,
    activeQuests,
    remainingReplacements,
    completeQuest,
    replaceQuest,
    invalidateQuests,
    isReplacingQuestId,
  ])

  const replacementText = useMemo(() => {
    if (isLoading || !replacementInfo) return 'Loading...'
    if (remainingReplacements === Infinity) return 'Unlimited replacements left'
    return `${remainingReplacements} replacement${remainingReplacements !== 1 ? 's' : ''} left today`
  }, [isLoading, replacementInfo, remainingReplacements])

  return (
    <PureQuestsDialog isOpen={isOpen} onOpenChange={onOpenChange} replacementText={replacementText}>
      {questContent}
    </PureQuestsDialog>
  )
}
