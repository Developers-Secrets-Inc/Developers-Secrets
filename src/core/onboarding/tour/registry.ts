export type OnboardingStep = {
  id: string
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
}

export type OnboardingTour = {
  id: string
  steps: OnboardingStep[]
}

// Onboarding registry per route. Keys must match usePathname() values (e.g., '/home').
// NOTE: If your actual URL differs, adjust the key accordingly.
export const onboardingRegistry = {
  '/home': {
    id: 'home',
    steps: [
      {
        id: 'current-course',
        title: 'Your current course',
        content: 'Resume your learning journey from here.',
        placement: 'bottom',
      },
      {
        id: 'recommended-challenge',
        title: 'Recommended challenge',
        content: 'Practice with a curated challenge tailored to your level.',
        placement: 'bottom',
      },
      {
        id: 'recommended-courses',
        title: 'Recommended courses',
        content: 'Explore courses selected to help you progress faster.',
        placement: 'bottom',
      },
      {
        id: 'user-profile',
        title: 'Your profile',
        content: 'Manage your info and track your progress here.',
        placement: 'left',
      },
      {
        id: 'division-leaderboard',
        title: 'Division leaderboard',
        content: 'See how you rank among your peers in the division.',
        placement: 'left',
      },
    ],
  },
} as const satisfies Record<string, OnboardingTour>
