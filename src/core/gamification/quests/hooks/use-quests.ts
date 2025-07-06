import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  completeUserQuest,
  replaceUserQuest,
  getQuestReplacementInfo,
  getSessionUserQuests,
  handleUserQuestsProgression,
} from '@/core/gamification/quests/actions'
import { useToast } from '@/components/ui/use-toast'
import { UserQuest } from '@/payload-types'

export const QUESTS_QUERY_KEY = ['user-quests']
export const QUEST_REPLACEMENT_INFO_QUERY_KEY = ['quest-replacement-info']

export function useQuests() {
  return useQuery({
    queryKey: QUESTS_QUERY_KEY,
    queryFn: getSessionUserQuests,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  })
}

export function useQuestReplacementInfo() {
  return useQuery({
    queryKey: QUEST_REPLACEMENT_INFO_QUERY_KEY,
    queryFn: getQuestReplacementInfo,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  })
}

export function useQuestActions() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const invalidateQuestQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUESTS_QUERY_KEY })
    queryClient.invalidateQueries({ queryKey: QUEST_REPLACEMENT_INFO_QUERY_KEY })
  }

  const replaceQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      const result = await replaceUserQuest(questId)
      if (!result.success) {
        throw new Error(result.error || 'An unknown error occurred.')
      }
      return result
    },
    onSuccess: () => {
      toast({ description: 'Quest replaced successfully.' })
      invalidateQuestQueries()
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to replace quest',
        description: error.message,
      })
    },
  })

  const progressQuestMutation = useMutation({
    mutationFn: (variables: { eventType: 'challengesCompleted'; userId: string }) => {
      // Pour l'instant, on ne gère qu'un seul type d'événement.
      return handleUserQuestsProgression(variables.userId, variables.eventType, 1)
    },
    onMutate: async (variables: { eventType: 'challengesCompleted'; userId: string }) => {
      await queryClient.cancelQueries({ queryKey: QUESTS_QUERY_KEY })

      const previousQuests = queryClient.getQueryData<UserQuest[]>(QUESTS_QUERY_KEY)

      queryClient.setQueryData<UserQuest[]>(QUESTS_QUERY_KEY, (oldQuests) => {
        if (!oldQuests) return []

        return oldQuests.map((userQuest) => {
          const quest = typeof userQuest.quest === 'object' ? userQuest.quest : null
          if (quest?.type === variables.eventType) {
            return {
              ...userQuest,
              currentProgression: (userQuest.currentProgression ?? 0) + 1,
            }
          }
          return userQuest
        })
      })

      return { previousQuests }
    },
    onError: (err, newTodo, context) => {
      if (context?.previousQuests) {
        queryClient.setQueryData(QUESTS_QUERY_KEY, context.previousQuests)
      }
      toast({
        variant: 'destructive',
        title: 'Failed to update quest progression',
        description: 'Your progress could not be saved. Please try again.',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUESTS_QUERY_KEY })
    },
  })

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: number) => {
      const userQuests = queryClient.getQueryData<UserQuest[]>(QUESTS_QUERY_KEY)
      if (!userQuests) {
        throw new Error('Quests data is not available in cache.')
      }

      const userQuestToComplete = userQuests.find((uq) => {
        const id = typeof uq.quest === 'object' && uq.quest !== null ? uq.quest.id : uq.quest
        return id === questId
      })

      if (!userQuestToComplete) {
        throw new Error(`UserQuest with id ${questId} not found in cache.`)
      }

      return await completeUserQuest(userQuestToComplete)
    },
    onSuccess: () => {
      invalidateQuestQueries()
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to complete quest',
        description: error.message,
      })
    },
  })

  return {
    completeQuest: completeQuestMutation.mutate,
    replaceQuest: replaceQuestMutation.mutate,
    invalidateQuests: invalidateQuestQueries,
    isReplacingQuestId: replaceQuestMutation.isPending ? replaceQuestMutation.variables : null,
    progressQuest: progressQuestMutation.mutate,
  }
}
