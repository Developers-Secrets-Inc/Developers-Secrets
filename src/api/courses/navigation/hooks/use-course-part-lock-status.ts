'use client'

import { useUser } from '@/core/users/contexts/user-context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useCoursePart } from '../../contexts/course-part-context'
import { coursePartTabs } from '../tabs-config'
import { unlockSolution } from '../../progression/solution'

type TabLockStatus = {
  [key: string]: boolean
}

export const getQueryKey = (challengeId: number, userId: string, challengeSlug: string) => [
  'challenge-tabs-lock-status',
  challengeId,
  userId,
  challengeSlug,
]

export function useCoursePartTabsLockStatus() {
  const { metadata, coursePart } = useCoursePart()
  const { user } = useUser()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  
  const userId = user.id

  const query = useQuery({
    queryKey: getQueryKey(coursePart.id, userId, coursePart.slug),
    queryFn: async () => {
      const tabs = coursePartTabs(`${metadata.courseSlug}/${metadata.chapterSlug}/${coursePart.slug}`, pathname)
      const lockedTabs: TabLockStatus = {}

      await Promise.all(
        tabs.map(async (tab) => {
          if (tab.lock?.isLocked) {
            lockedTabs[tab.id] = await tab.lock.isLocked(coursePart.id, userId)
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
      const tabs = coursePartTabs(`${metadata.courseSlug}/${metadata.chapterSlug}/${coursePart.slug}`, pathname)
      const tab = tabs.find((t) => t.id === tabId)
      if (!tab || !tab.lock) {
        throw new Error('Tab or lock configuration not found')
      }
      
      // Pour les onglets de solution, on utilise setSolutionUnlocked
      if (tabId === 'official-solution' || tabId === 'solutions') {
        await unlockSolution({userId, partId: coursePart.id})
      } else if (tab.lock.onConfirm) {
        // Pour d'autres onglets qui pourraient avoir une logique custom
        await tab.lock.onConfirm(coursePart.id, userId)
      }
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getQueryKey(coursePart.id, userId, coursePart.slug),
      })
    },
  })

  return {
    data: query.data?.lockedTabs,
    tabs: query.data?.tabs || coursePartTabs(`${metadata.courseSlug}/${metadata.chapterSlug}/${coursePart.slug}`, pathname),
    pathname,
    isLoading: query.isLoading,
    error: query.error,
    unlockTab: mutation.mutate,
    isUnlocking: mutation.isPending,
  }
}
