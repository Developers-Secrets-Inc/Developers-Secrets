'use client'

import { useReducer, useEffect } from 'react'
import { useSolutionUnlockStatus, useUnlockSolution } from './use-solution-queries'
import { navigationReducer, initialNavigationState, NavigationState } from './navigation-reducer'

export const useNavigationState = (
  initialState: Partial<NavigationState> = {},
  challengeId: number,
  userId: string,
  challengeSlug: string,
) => {
  const [state, dispatch] = useReducer(navigationReducer, {
    ...initialNavigationState,
    ...initialState,
  })

  const { data: isUnlocked, isLoading: isCheckingUnlock } = useSolutionUnlockStatus(
    userId,
    challengeId,
  )
  const { mutateAsync: unlockSolution, isPending: isUnlocking } = useUnlockSolution()

  useEffect(() => {
    if (isUnlocked) {
      const unlockedPaths = [
        `/challenges/${challengeSlug}/official-solution`,
        `/challenges/${challengeSlug}/solutions`,
      ]
      dispatch({ type: 'INITIALIZE_UNLOCKED_PATHS', payload: unlockedPaths })
    }
  }, [isUnlocked, challengeSlug])

  const setShowConfirmDialog = (show: boolean) =>
    dispatch({ type: 'SET_SHOW_CONFIRM_DIALOG', payload: show })

  const setPendingPath = (path: string | null) =>
    dispatch({ type: 'SET_PENDING_PATH', payload: path })

  const unlockPath = async (path: string) => {
    const pathsToUnlock = [
      path,
      `/challenges/${challengeSlug}/official-solution`,
      `/challenges/${challengeSlug}/solutions`,
    ]
    dispatch({ type: 'UNLOCK_PATHS', payload: pathsToUnlock })

    try {
      await unlockSolution({ userId, challengeId })
    } catch (error) {
      console.error('Failed to unlock solution:', error)
      // Optionally revert the state if the API call fails
    }
  }

  const isPathUnlocked = (path: string) => state.unlockedPaths.includes(path)

  return {
    state,
    setShowConfirmDialog,
    setPendingPath,
    unlockPath,
    isPathUnlocked,
    isLoading: isCheckingUnlock || isUnlocking,
  }
}
