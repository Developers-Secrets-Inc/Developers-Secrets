'use client'

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { Quest, UserQuest as PayloadUserQuest } from '@/payload-types'
import { Award } from 'lucide-react'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { QuestCard } from './quest-card'
import { completeUserQuest, fetchUserQuests } from '../actions'
import { Skeleton } from '@/components/ui/skeleton'

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
  const [activeQuests, setActiveQuests] = useState<UserQuest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mémoiser la fonction de chargement des quêtes
  const loadQuests = useCallback(async () => {
    if (isOpen) {
      setIsLoading(true)
      setError(null)
      try {
        const quests = await fetchUserQuests()
        setActiveQuests(quests as UserQuest[])
      } catch (error) {
        console.error('Failed to fetch quests:', error)
        setError('Failed to load quests')
      } finally {
        setIsLoading(false)
      }
    }
  }, [isOpen])

  useEffect(() => {
    loadQuests()
  }, [loadQuests])

  // Mémoiser les fonctions de gestion des quêtes
  const handleDeclineQuest = useCallback(async (questId: string) => {
    try {
      // Optimistically remove the quest from the UI
      setActiveQuests((prevQuests) => prevQuests.filter((q) => q.quest.id.toString() !== questId))

      // Refresh quests to get the new one
      const updatedQuests = await fetchUserQuests()
      setActiveQuests(updatedQuests as UserQuest[])
    } catch (error) {
      console.error('Failed to decline quest:', error)
      setError('Failed to decline quest')
    }
  }, [])

  const handleCompleteQuest = useCallback(async (questId: string) => {
    try {
      await completeUserQuest(questId)
      setActiveQuests((prevQuests) =>
        prevQuests.map((quest) =>
          quest.quest.id.toString() === questId ? { ...quest, isCompleted: true } : quest,
        ),
      )
    } catch (error) {
      console.error('Failed to complete quest:', error)
      setError('Failed to complete quest')
    }
  }, [])

  // Mémoiser les quêtes triées
  const sortedQuests = useMemo(() => {
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
      return (
        <>
          <QuestSkeleton />
          <QuestSkeleton />
          <QuestSkeleton />
          <QuestSkeleton />
        </>
      )
    }

    if (error) {
      return <div className="text-center text-red-500">{error}</div>
    }

    if (sortedQuests.length === 0) {
      return <div className="text-center text-muted-foreground">No quests available</div>
    }

    return sortedQuests.map((userQuest) => (
      <QuestCard
        key={userQuest.id}
        userQuest={userQuest}
        onDeclineQuest={() => handleDeclineQuest(userQuest.quest.id.toString())}
        onCompleteQuest={() => handleCompleteQuest(userQuest.quest.id.toString())}
      />
    ))
  }, [isLoading, error, sortedQuests, handleDeclineQuest, handleCompleteQuest])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-amber-500" />
            Available Quests
          </DialogTitle>
          <DialogDescription>
            Progress in your learning journey by completing these quests to earn experience.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">{questContent}</div>
      </DialogContent>
    </Dialog>
  )
}
