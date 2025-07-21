'use client'

import { Award, FileText, ListChecks, Lock, Users, Loader2 } from 'lucide-react'
import { useMemo } from 'react'

export function useTabsConfiguration(
  challengeSlug: string,
  pathname: string,
  isSolutionAccessible: boolean,
  isLoadingSolutionStatus: boolean,
) {
  return useMemo(
    () => [
      {
        name: 'Description',
        href: `/challenges/${challengeSlug}/description`,
        icon: FileText,
        current: pathname === `/challenges/${challengeSlug}/description`,
        requiresConfirmation: false,
        isLoading: false,
      },
      {
        name: 'Official Solution',
        href: `/challenges/${challengeSlug}/official-solution`,
        icon: isSolutionAccessible ? Award : Lock,
        current: pathname === `/challenges/${challengeSlug}/official-solution`,
        requiresConfirmation: !isSolutionAccessible && !isLoadingSolutionStatus,
        isLoading: isLoadingSolutionStatus,
      },
      {
        name: 'Solutions',
        href: `/challenges/${challengeSlug}/solutions`,
        icon: isSolutionAccessible ? Users : Lock,
        current: pathname.startsWith(`/challenges/${challengeSlug}/solutions`),
        requiresConfirmation: !isSolutionAccessible && !isLoadingSolutionStatus,
        isLoading: isLoadingSolutionStatus,
      },
      {
        name: 'Submissions',
        href: `/challenges/${challengeSlug}/submissions`,
        icon: ListChecks,
        current: pathname.startsWith(`/challenges/${challengeSlug}/submissions`),
        requiresConfirmation: false,
        isLoading: false,
      },
    ],
    [challengeSlug, pathname, isSolutionAccessible, isLoadingSolutionStatus],
  )
}
