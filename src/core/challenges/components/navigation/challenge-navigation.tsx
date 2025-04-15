'use client'

import { NavigationTab } from './navigation-tab.client'
import { ConfirmationDialog } from './confirmation-dialog.client'
import { useChallengeNavigation } from '../../hooks/use-challenge-navigation'

/**
 * Props for the ChallengeNavigation component
 */
type ChallengeNavigationProps = {
  /** The challenge object containing id and slug */
  challenge: {
    id: number
    slug: string
  }
  /** The unique identifier of the current user */
  userId: string
}

/**
 * A client component that renders the navigation bar for a challenge.
 * This component orchestrates the navigation between different sections of a challenge
 * (description, solution, submissions) and handles the unlocking flow for protected content.
 *
 * Uses the useChallengeNavigation hook to manage all the navigation logic and state.
 *
 * @example
 * ```tsx
 * <ChallengeNavigation
 *   challenge={{
 *     id: 123,
 *     slug: "binary-search"
 *   }}
 *   userId="1a2b3c"
 * />
 * ```
 */
export const ChallengeNavigation = ({
  challenge,
  userId,
}: ChallengeNavigationProps) => {
  const { tabs, getTabProps, dialogProps } = useChallengeNavigation({
    challengeSlug: challenge.slug,
    challengeId: challenge.id,
    userId,
  })

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
