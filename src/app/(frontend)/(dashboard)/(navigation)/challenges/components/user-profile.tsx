'use client'
import { LinkButton } from '@/components/common/link-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserProfileData } from '@/core/user-profile'
import { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { CalendarDayButton } from './calendar-day-button'
import { DailyEntriesBadge } from '@/core/gamification/streaks/login-entries/components/daily-entries-badge'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface UserProfileProps {
  user: User
}

const getRoleBadgeVariant = (
  role: string | undefined,
): React.ComponentProps<typeof Badge>['variant'] => {
  switch (role) {
    case 'pro':
    case 'max':
      return 'default'
    case 'basic':
    default:
      return 'secondary'
  }
}

const getRoleBadgeClass = (role: string | undefined): string => {
  switch (role) {
    case 'pro':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20'
    case 'max':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-500'
    case 'basic':
    default:
      return 'bg-background border border-border'
  }
}

export const UserProfileCardSkeleton = () => (
  <Card className="w-full py-0">
    <CardContent className="pt-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
            <Skeleton className="h-4 w-1/3" />
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-2 w-full mt-1.5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-7 mb-1">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex justify-center items-center">
              <Skeleton className="h-3 w-5" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: 35 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-7 rounded" />
          ))}
        </div>
      </div>
    </CardContent>
    <CardFooter className="px-6 pb-6 pt-0">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
)

export const UserProfile = ({ user }: UserProfileProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-profile', user.id],
    queryFn: () => getUserProfileData(user.id),
    enabled: !!user.id,
  })

  if (isLoading) return <UserProfileCardSkeleton />
  if (isError || !data) return <div className="text-destructive">Failed to load profile.</div>

  const { userGamificationsInformation, calendarDays, nextLevelExperience, totalCompletedCount } =
    data

  const experiencePercentage =
    (userGamificationsInformation.currentExperience / nextLevelExperience) * 100

  const role = user.informations.role

  return (
    <Card className="relative w-full py-0 overflow-hidden">
      <MoonBorders />

      <div className="relative z-10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.informations.avatar} alt={user.informations.name} />
              <AvatarFallback>
                {user.informations.name?.substring(0, 2).toUpperCase() ?? '??'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.informations.name}</h3>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground mt-1">
                {role && (
                  <>
                    <Badge
                      variant={getRoleBadgeVariant(role)}
                      className={
                        'capitalize text-xs px-1.5 py-0.5 font-medium border ' +
                        getRoleBadgeClass(role)
                      }
                    >
                      {role}
                    </Badge>
                  </>
                )}
                <DailyEntriesBadge userId={user.id} />
              </div>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground mt-2">
                <span>
                  {userGamificationsInformation.currentExperience} / {nextLevelExperience} XP
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Level {userGamificationsInformation.currentLevel}</span>
              </div>
              <Progress value={experiencePercentage} className="h-2 mt-1.5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-7 mb-1">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex justify-center items-center text-xs text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((day: any, index: number) => (
                <div key={index} className="flex justify-center items-center">
                  <CalendarDayButton
                    day={day?.day ?? null}
                    date={day?.date ?? null}
                    completedChallengesCount={day?.completedChallengesCount ?? 0}
                    prefetchedChallenges={day?.completedChallenges ?? null}
                    isPlaceholder={!day}
                    userId={user.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-2">
          <LinkButton variant="outline" className="w-full" href={`/profile/me`}>
            View full profile
          </LinkButton>
        </CardFooter>
      </div>
    </Card>
  )
}


const MoonBorders = () => {
  return (
    <>
      <MoonBorder size={24} />
      <MoonBorder size={32} />
      <MoonBorder size={40} />
    </>

  )
}


const MoonBorder = ({ size }: { size: number }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute top-0 right-0 h-${size} w-${size} -translate-y-1/2 translate-x-1/2 pointer-events-none`}
    >
      <div className="h-full w-full rounded-full border border-gray-200/30 opacity-20" />
    </div>
  )
}
