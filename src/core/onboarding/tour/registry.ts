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
    ],
  },
} as const satisfies Record<string, OnboardingTour>
