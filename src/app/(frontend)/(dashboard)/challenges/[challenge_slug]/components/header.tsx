import { OpenChallengeCompletionDialogInDevelopment } from '@/components/challenges/open-challenge-completion-dialog-in-development'
import { NotificationButton } from '@/components/sidebars/home-sidebar/notification-button'
import { ChallengeNavigationButtons } from '@/core/challenges/components/challenge-navigation-buttons'
import { Button } from '@/components/ui/button'
import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { User } from '@/types/user'
import { UserDropdownMenu } from '@/core/user/components/user-dropdown-menu'



export const ChallengeLayoutHeader = ({
  challengeSlug,
  user,
  challengeId,
}: {
  challengeSlug: string
  user: User
  challengeId: number
}) => {
  return (
    <header className="flex-none py-3 px-4 bg-background">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch={true}>
            <Eclipse size={23} />
          </Link>
          <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
            <ChallengeNavigationButtons currentChallengeSlug={challengeSlug} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <OpenChallengeCompletionDialogInDevelopment
            challengeId={challengeId}
            userId={user.id}
            challengeSlug={challengeSlug}
          />
          <NotificationButton />

          <Button variant="outline" size="sm" asChild>
            <Link href="/home">Dashboard</Link>
          </Button>
          <UserDropdownMenu user={user} />
        </div>
      </div>
    </header>
  )
}