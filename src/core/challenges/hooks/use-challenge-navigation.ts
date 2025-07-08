'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useNavigationState } from './use-navigation-state'
import { useTabsConfiguration } from './use-tabs-configuration'

import { useChallengeStore } from '@/core/challenges/store'
import { useSolutionUnlockStatus } from '@/core/challenges/hooks/use-solution-queries'

export function useChallengeNavigation() {
  const { challenge, user } = useChallengeStore()
  const challengeSlug = challenge?.slug || ''
  const challengeId = challenge?.id || 0
  const userId = user?.id || ''
  const pathname = usePathname()
  const router = useRouter()

  const { data: isSolutionAccessibleByServer, isLoading: isLoadingSolutionStatus } =
    useSolutionUnlockStatus(userId, challengeId)

  const {
    state: { showConfirmDialog, pendingPath, unlockedPaths },
    setShowConfirmDialog,
    setPendingPath,
    unlockPath,
    isPathUnlocked,
  } = useNavigationState({}, challengeId, userId, challengeSlug)

  const tabs = useTabsConfiguration(
    challengeSlug,
    pathname,
    isSolutionAccessibleByServer ?? false,
    isLoadingSolutionStatus,
  )

  // Prefetch logic
  useEffect(() => {
    tabs.forEach((tab) => {
      if (!tab.current) {
        router.prefetch(tab.href)
      }
    })
  }, [tabs, router])

  const handleTabClick = (href: string, requiresConfirmation: boolean, isLoadingTab: boolean) => {
    // Empêche toute interaction si l'onglet est en cours de chargement
    if (isLoadingTab) {
      return
    }

    if (requiresConfirmation) {
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
      onClick: () => handleTabClick(tab.href, tab.requiresConfirmation, tab.isLoading),
      isLocked: tab.requiresConfirmation,
    }),

    // Dialog handlers
    dialogProps: {
      open: showConfirmDialog,
      onOpenChange: setShowConfirmDialog,
      onConfirm: handleConfirm,
    },
  }
}
