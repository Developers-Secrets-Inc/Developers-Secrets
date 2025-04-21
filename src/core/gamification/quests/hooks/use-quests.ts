import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchUserQuests,
  completeUserQuest,
  replaceUserQuest,
} from '@/core/gamification/quests/actions'

// Clé pour identifier la query des quêtes
export const QUESTS_QUERY_KEY = ['user-quests']

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

// Hook pour les actions sur les quêtes
export function useQuestActions() {
  const queryClient = useQueryClient()

  const invalidateQuests = () => {
    queryClient.invalidateQueries({ queryKey: QUESTS_QUERY_KEY })
  }

  const completeQuest = async (questId: string) => {
    await completeUserQuest(questId)
    // Invalider le cache après avoir complété une quête
    invalidateQuests()
  }

  // Action pour remplacer une quête
  const replaceQuest = async (questId: string) => {
    // TODO: Add optimistic update?
    try {
      await replaceUserQuest(questId)
      // Invalider le cache après avoir remplacé une quête
      invalidateQuests()
    } catch (error) {
      console.error('Failed to replace quest:', error)
      // TODO: Add error handling (e.g., toast notification)
    }
  }

  return {
    completeQuest,
    replaceQuest, // Expose the new action
    invalidateQuests,
  }
}
