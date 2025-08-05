import { UserDropdownMenu } from '@/core/user/components/user-dropdown-menu'
import Link from 'next/link'
import { Button } from '../ui/button'
import { NotificationButton } from '../sidebars/home-sidebar/notification-button'
import { Skeleton } from '../ui/skeleton'
import { DailyEntriesBadge } from '@/core/gamification/streaks/login-entries/components/daily-entries-badge'
import { User } from '@/core/users/types'

const LoginButton = () => {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/auth/login">Log in</Link>
    </Button>
  )
}

const SignupButton = () => {
  return (
    <Button size="sm" asChild>
      <Link href="/auth/signup">Sign up</Link>
    </Button>
  )
}

const DashboardButton = () => {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/home">Dashboard</Link>
    </Button>
  )
}

const AuthButtonsSkeleton = () => {
  return <Skeleton className="w-10 h-10 rounded-full" />
}

const AuthButtonsLoggedIn = ({ user }: { user: User }) => {
  return (
    <>

      <NotificationButton />
      <DashboardButton />
      <UserDropdownMenu />
    </>
  )
}

const AuthButtonsLoggedOut = () => {
  return (
    <>
      <LoginButton />
      <SignupButton />
    </>
  )
}

const AuthButtons = {
  Skeleton: AuthButtonsSkeleton,
  LoggedIn: AuthButtonsLoggedIn,
  LoggedOut: AuthButtonsLoggedOut,
}

const IsLoading = ({
  children,
  isLoading,
  fallback,
}: {
  children: React.ReactNode
  isLoading: boolean
  fallback: React.ReactNode
}) => {
  return isLoading ? fallback : children
}


type AuthButtonsClientProps = {
  user: User | undefined
  isLoading: boolean
}

export const AuthButtonsClient = ({ user, isLoading }: AuthButtonsClientProps) => {
  return (
    <div className="ml-auto flex items-center gap-2">
      <IsLoading isLoading={isLoading} fallback={<AuthButtons.Skeleton />}>
        {user ? <AuthButtons.LoggedIn user={user} /> : <AuthButtons.LoggedOut />}
      </IsLoading>
    </div>
  )
}
