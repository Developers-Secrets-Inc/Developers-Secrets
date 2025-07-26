'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TabConfig, challengeTabs } from '../../tabs-config'
import { useChallenge } from '../../contexts/challenge-context'
import { useUser } from '@/core/users/contexts/user-context'
import { usePathname } from 'next/navigation'
import { setSolutionUnlocked } from '@/core/challenges/user-progression/completion-status'

type TabLockStatus = {
  [key: string]: boolean
}

export const getQueryKey = (challengeId: number, userId: string, challengeSlug: string) => [
  'challenge-tabs-lock-status',
  challengeId,
  userId,
  challengeSlug,
]

export function useChallengeTabsLockStatus() {
  const { challenge } = useChallenge()
  const { user } = useUser()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  
  const challengeSlug = challenge.slug
  const challengeId = challenge.id
  const userId = user.id

  const query = useQuery({
    queryKey: getQueryKey(challengeId, userId, challengeSlug),
    queryFn: async () => {
      const tabs = challengeTabs(challengeSlug, pathname)
      const lockedTabs: TabLockStatus = {}

      await Promise.all(
        tabs.map(async (tab) => {
          if (tab.lock?.isLocked) {
            lockedTabs[tab.id] = await tab.lock.isLocked(challengeId, userId)
          } else {
            lockedTabs[tab.id] = false
          }
        }),
      )

      return { lockedTabs, tabs }
    },
  })

  const mutation = useMutation({
    mutationFn: async (tabId: string) => {
      const tabs = challengeTabs(challengeSlug, pathname)
      const tab = tabs.find((t) => t.id === tabId)
      if (!tab || !tab.lock) {
        throw new Error('Tab or lock configuration not found')
      }
      
      // Pour les onglets de solution, on utilise setSolutionUnlocked
      if (tabId === 'official-solution' || tabId === 'solutions') {
        await setSolutionUnlocked(userId, challengeId)
      } else if (tab.lock.onConfirm) {
        // Pour d'autres onglets qui pourraient avoir une logique custom
        await tab.lock.onConfirm(challengeId, userId)
      }
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getQueryKey(challengeId, userId, challengeSlug),
      })
    },
  })

  return {
    data: query.data?.lockedTabs,
    tabs: query.data?.tabs || challengeTabs(challengeSlug, pathname),
    pathname,
    isLoading: query.isLoading,
    error: query.error,
    unlockTab: mutation.mutate,
    isUnlocking: mutation.isPending,
  }
}
