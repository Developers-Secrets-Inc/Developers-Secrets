'use client'

import { Award, FileText, ListChecks, Lock, Users } from 'lucide-react'
import { useMemo } from 'react'


export function useTabsConfiguration(challengeSlug: string, pathname: string, unlockedPaths: string[]) {
    return useMemo(
      () => [
        {
          name: 'Description',
          href: `/challenges/${challengeSlug}/description`,
          icon: FileText,
          current: pathname === `/challenges/${challengeSlug}/description`,
          requiresConfirmation: false,
        },
        {
          name: 'Official Solution',
          href: `/challenges/${challengeSlug}/official-solution`,
          icon: unlockedPaths.includes(`/challenges/${challengeSlug}/official-solution`)
            ? Award
            : Lock,
          current: pathname === `/challenges/${challengeSlug}/official-solution`,
          requiresConfirmation: true,
        },
        {
          name: 'Solutions',
          href: `/challenges/${challengeSlug}/solutions`,
          icon: unlockedPaths.includes(`/challenges/${challengeSlug}/solutions`) ? Users : Lock,
          current: pathname.startsWith(`/challenges/${challengeSlug}/solutions`),
          requiresConfirmation: true,
        },
        {
          name: 'Submissions',
          href: `/challenges/${challengeSlug}/submissions`,
          icon: ListChecks,
          current: pathname.startsWith(`/challenges/${challengeSlug}/submissions`),
          requiresConfirmation: false,
        },
      ],
      [challengeSlug, pathname, unlockedPaths],
    )
  }