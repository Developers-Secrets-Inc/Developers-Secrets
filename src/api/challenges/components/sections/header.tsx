import { HomeLink } from '@/components/common/home-link'
import { NotificationButton } from '@/components/sidebars/home-sidebar/notification-button'
import { Button } from '@/components/ui/button'
import { UserDropdownMenu } from '@/core/users/components/user-dropdown-menu'
import Link from 'next/link'
import React from 'react'
import { ChallengeNavigationButtons } from '../navigation/buttons'

type WithChildren = {
  children: React.ReactNode
}

const ChallengeHeaderRoot: React.FC<WithChildren> = ({ children }) => {
  return (
    <header className="flex-none py-2 px-4 bg-background border-b border-border h-14">
      <div className="flex items-center justify-between w-full h-full">{children}</div>
    </header>
  )
}

const ChallengeHeaderLeftPart: React.FC<WithChildren> = ({ children }) => {
  return <div className="flex items-center gap-4">{children}</div>
}

const ChallengeHeaderRightPart: React.FC<WithChildren> = ({ children }) => {
  return <div className="flex items-center gap-4">{children}</div>
}

export const ChallengeHeader = {
  Root: ChallengeHeaderRoot,
  LeftPart: ChallengeHeaderLeftPart,
  RightPart: ChallengeHeaderRightPart,
}

export const DefaultChallengeHeader = ({ navigationChallenges }: {
  navigationChallenges: {
    previousChallenge: {id: number, slug: string}
    nextChallenge: {id: number, slug: string}
    randomChallenge: {id: number, slug: string}
  }
}) => {
  return (
    <ChallengeHeader.Root>
      <ChallengeHeader.LeftPart>
        <HomeLink />
        <ChallengeNavigationButtons 
          previousChallenge={navigationChallenges.previousChallenge}
          nextChallenge={navigationChallenges.nextChallenge}
          randomChallenge={navigationChallenges.randomChallenge}
        />
      </ChallengeHeader.LeftPart>
      <ChallengeHeader.RightPart>
        <NotificationButton />
        <DashboardButton />
        <UserDropdownMenu />
      </ChallengeHeader.RightPart>
    </ChallengeHeader.Root>
  )
}

const DashboardButton = () => {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/home">Dashboard</Link>
    </Button>
  )
}
