import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  fetchUserQuests,
  completeUserQuest,
  replaceUserQuest,
  getQuestReplacementInfo,
} from '@/core/gamification/quests/actions'
import { useToast } from '@/components/ui/use-toast'

// Clé pour identifier la query des quêtes
export const QUESTS_QUERY_KEY = ['user-quests']
export const QUEST_REPLACEMENT_INFO_QUERY_KEY = ['quest-replacement-info']

// Hook pour récupérer les quêtes
export function useQuests() {
  return useQuery({
    queryKey: QUESTS_QUERY_KEY,
    queryFn: fetchUserQuests,
    // Options de configuration
    staleTime: 30000, // Considérer les données comme périmées après 30s
    refetchOnWindowFocus: true, // Rafraîchir quand l'onglet reprend le focus
  })
}

// --- New Hook to fetch replacement info ---
export function useQuestReplacementInfo() {
  return useQuery({
    queryKey: QUEST_REPLACEMENT_INFO_QUERY_KEY,
    queryFn: getQuestReplacementInfo,
    staleTime: 30000, // Same staleness
    refetchOnWindowFocus: true, // Refresh on focus too
  })
}
// --- End New Hook ---

// Hook pour les actions sur les quêtes
export function useQuestActions() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isReplacingQuestId, setIsReplacingQuestId] = useState<string | null>(null)

  const invalidateQuests = () => {
    queryClient.invalidateQueries({ queryKey: QUESTS_QUERY_KEY })
    queryClient.invalidateQueries({ queryKey: QUEST_REPLACEMENT_INFO_QUERY_KEY })
  }

  const completeQuest = async (questId: string) => {
    await completeUserQuest(questId)
    invalidateQuests()
  }

  const replaceQuest = async (questId: string) => {
    setIsReplacingQuestId(questId)
    try {
      const result = await replaceUserQuest(questId)
      if (result.success) {
        toast({ description: 'Quest replaced successfully.' })
        invalidateQuests()
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to replace quest',
          description: result.error || 'An unknown error occurred.',
        })
      }
    } catch (error) {
      console.error('Failed to replace quest:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to replace quest',
        description:
          error instanceof Error ? error.message : 'An unexpected client-side error occurred.',
      })
    } finally {
      setIsReplacingQuestId(null)
    }
  }

  return {
    completeQuest,
    replaceQuest,
    invalidateQuests,
    isReplacingQuestId,
  }
}
