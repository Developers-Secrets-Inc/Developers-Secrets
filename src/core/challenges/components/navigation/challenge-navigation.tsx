'use client'

import { NavigationTab } from './navigation-tab.client'
import { ConfirmationDialog } from './confirmation-dialog.client'
import { useChallengeNavigation } from '../../hooks/use-challenge-navigation'

/**
 * ChallengeNavigation component that displays a navigation bar for different sections of a challenge
 * (description, solution, submissions) and handles the unlocking flow for protected content.
 *
 * Uses the useChallengeNavigation hook to manage all the navigation logic and state.
 *
 * @example
 * ```tsx
 * <ChallengeNavigation />
 * ```
 */
export const ChallengeNavigation = () => {
  const { tabs, getTabProps, dialogProps } = useChallengeNavigation()


  return (
    <>
      <nav className="h-12 flex-none border-b bg-background">
        <div className="flex h-full">
          {tabs.map((tab) => (
            <NavigationTab key={tab.name} {...getTabProps(tab)} />
          ))}
        </div>
      </nav>

      <ConfirmationDialog {...dialogProps} />
    </>
  )
}
