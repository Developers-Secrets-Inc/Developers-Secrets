'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TabConfig } from '../../tabs-config'

type TabLockStatus = {
  [key: string]: boolean
}

type UseChallengeTabsLockStatusProps = {
  tabs: TabConfig[]
  challengeSlug: string
  userId: string
}

const getQueryKey = (challengeSlug: string, userId: string) => [
  'challenge-tabs-lock-status',
  challengeSlug,
  userId,
]

export function useChallengeTabsLockStatus({
  tabs,
  challengeSlug,
  userId,
}: UseChallengeTabsLockStatusProps) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: getQueryKey(challengeSlug, userId),
    queryFn: async () => {
      const lockedTabs: TabLockStatus = {}

      await Promise.all(
        tabs.map(async (tab) => {
          if (tab.lock?.isLocked) {
            lockedTabs[tab.id] = await tab.lock.isLocked(challengeSlug, userId)
          } else {
            lockedTabs[tab.id] = false
          }
        }),
      )

      return lockedTabs
    },
  })

  const mutation = useMutation({
    mutationFn: async (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId)
      if (!tab || !tab.lock?.onConfirm) {
        throw new Error('Tab or lock configuration not found')
      }
      return tab.lock.onConfirm(challengeSlug, userId)
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getQueryKey(challengeSlug, userId),
      })
    },
  })

  return {
    ...query,
    unlockTab: mutation.mutate,
    isUnlocking: mutation.isPending,
  }
}
