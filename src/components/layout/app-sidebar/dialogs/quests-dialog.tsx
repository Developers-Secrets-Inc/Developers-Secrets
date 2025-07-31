'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock } from 'lucide-react'
import { useSpecificDialog } from '../stores/sidebar-dialogs-store'

import { useMemo } from 'react'
import { useQuestActions, useQuestReplacementInfo, useQuests } from '@/core/gamification/quests/hooks/use-quests'
import { Quest, UserQuest } from '@/payload-types'
import { QuestCard } from '@/core/gamification/quests/components/quest-card'
import { Skeleton } from '@/components/ui/skeleton'


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


export const QuestsDialog = () => {
  const { isOpen, close } = useSpecificDialog('quests')

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
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Active Quests</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="daily" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily Quests</TabsTrigger>
            <TabsTrigger value="quests">All Quests</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            {questContent}
          </TabsContent>

          <TabsContent value="quests" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                More quests are on their way. Stay tuned for exciting challenges!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
