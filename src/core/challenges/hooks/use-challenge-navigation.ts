'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useNavigationState } from './use-navigation-state'
import { useTabsConfiguration } from './use-tabs-configuration'

type UseChallengeNavigationProps = {
  challengeSlug: string
  challengeId: number
  userId: string
}

export function useChallengeNavigation({
  challengeSlug,
  challengeId,
  userId,
}: UseChallengeNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()

  const {
    state: { showConfirmDialog, pendingPath, unlockedPaths },
    setShowConfirmDialog,
    setPendingPath,
    unlockPath,
    isPathUnlocked,
  } = useNavigationState({}, challengeId, userId, challengeSlug)

  const tabs = useTabsConfiguration(challengeSlug, pathname, unlockedPaths)

  // Prefetch logic
  useEffect(() => {
    tabs.forEach((tab) => {
      if (!tab.current) {
        router.prefetch(tab.href)
      }
    })
  }, [tabs, router])

  const handleTabClick = (href: string, requiresConfirmation: boolean) => {
    if (requiresConfirmation && !isPathUnlocked(href)) {
      setShowConfirmDialog(true)
      setPendingPath(href)
      return
    }
    router.push(href)
  }

  const handleConfirm = () => {
    if (pendingPath) {
      const pathToNavigate = pendingPath
      setShowConfirmDialog(false)
      setPendingPath(null)
      unlockPath(pathToNavigate)
      router.push(pathToNavigate)
    }
  }

  return {
    // État
    tabs,
    showConfirmDialog,

    // Computed values
    getTabProps: (tab: (typeof tabs)[0]) => ({
      ...tab,
      onClick: () => handleTabClick(tab.href, tab.requiresConfirmation),
      isLocked: tab.requiresConfirmation && !isPathUnlocked(tab.href),
    }),

    // Dialog handlers
    dialogProps: {
      open: showConfirmDialog,
      onOpenChange: setShowConfirmDialog,
      onConfirm: handleConfirm,
    },
  }
}
