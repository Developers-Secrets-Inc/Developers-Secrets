'use client'

import { useCallback, useOptimistic, useState } from 'react'

export type UserProgress = {
  level: number
  experience: number
  nextLevelExperience: number
}

export type CompletionState = {
  isLoading: boolean
  experienceGained: number
  nextChallengeUrl: string
  wasUnlocked: boolean
}

export type AnimationState = {
  isAnimatingExp: boolean
  showLevelUp: boolean
  hasLeveledUp: boolean
  levelUpsRemaining: number[]
}

export type OptimisticAction = {
  type: 'add_experience'
  amount: number
}

const defaultProgress: UserProgress = {
  level: 1,
  experience: 0,
  nextLevelExperience: 100,
}

export function useCompletionState(initialProgress: UserProgress = defaultProgress) {
  // État optimiste pour la progression
  const [optimisticProgress, addOptimisticProgress] = useOptimistic<UserProgress, OptimisticAction>(
    initialProgress,
    (state, action) => {
      if (action.type === 'add_experience') {
        let { level, experience, nextLevelExperience } = state
        experience += action.amount

        // Calculer les level ups
        while (experience >= nextLevelExperience) {
          level++
          experience -= nextLevelExperience
          nextLevelExperience = Math.floor(nextLevelExperience * 1.5)
        }

        return { level, experience, nextLevelExperience }
      }
      return state
    },
  )

  // État pour le chargement et les données de complétion
  const [completionState, setCompletionState] = useState<CompletionState>({
    isLoading: true,
    experienceGained: 0,
    nextChallengeUrl: '/challenges',
    wasUnlocked: false,
  })

  // État pour les animations
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimatingExp: false,
    showLevelUp: false,
    hasLeveledUp: false,
    levelUpsRemaining: [],
  })

  // Actions pour les animations
  const startExperienceAnimation = useCallback(
    () => setAnimationState((s) => ({ ...s, isAnimatingExp: true })),
    [],
  )

  const stopExperienceAnimation = useCallback(
    () => setAnimationState((s) => ({ ...s, isAnimatingExp: false })),
    [],
  )

  const showLevelUpAnimation = useCallback(
    (levels: number[]) =>
      setAnimationState((s) => ({
        ...s,
        showLevelUp: true,
        hasLeveledUp: true,
        levelUpsRemaining: levels,
      })),
    [],
  )

  const handleLevelUpComplete = useCallback(() => {
    setAnimationState((s) => {
      const [_, ...remaining] = s.levelUpsRemaining
      return {
        ...s,
        showLevelUp: false,
        levelUpsRemaining: remaining,
        hasLeveledUp: remaining.length > 0,
      }
    })
  }, [])

  const addExperience = useCallback(
    (amount: number) => addOptimisticProgress({ type: 'add_experience', amount }),
    [addOptimisticProgress],
  )

  return {
    // États
    progress: optimisticProgress,
    completion: completionState,
    animation: animationState,

    // Actions pour la progression
    addExperience,

    // Actions pour l'état de complétion
    setCompletion: setCompletionState,

    // Actions pour les animations
    startExperienceAnimation,
    stopExperienceAnimation,
    showLevelUpAnimation,
    handleLevelUpComplete,
  }
}
