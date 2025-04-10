import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy } from 'lucide-react'
import Link from 'next/link'
import * as Tooltip from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { getUser } from '@/core/user'
import { getGamificationInformations, getUserNextLevelExperience } from '@/core/gamification/level'
import { getCompletedChallengesPerDay } from '@/core/challenges/user-progression'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarDay {
  date: string
  day: number
  completedChallenges: number
}

const getCalendarDays = async (userId: string) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  // Get completed challenges for the current month
  const completedChallenges = await getCompletedChallengesPerDay(userId)

  // Get the first day of the month and total days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let firstDayIndex = firstDay.getDay()
  // Convert Sunday from 0 to 7 to match our calendar layout
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1

  // Create a flat array of all calendar cells
  const allDays: (CalendarDay | null)[] = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayIndex; i++) {
    allDays.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateString = date.toISOString().split('T')[0]
    allDays.push({
      date: dateString,
      day,
      completedChallenges: completedChallenges[dateString] || 0,
    })
  }

  // Convert the flat array into columns (7 columns for each day of the week)
  const columns: (CalendarDay | null)[][] = Array.from({ length: 7 }, (_, columnIndex) => {
    return allDays.filter((_, index) => index % 7 === columnIndex)
  })

  return columns
}

export const UserProfile = async () => {
  const user = await getUser()
  if (!user) return null

  const userGamificationsInformation = await getGamificationInformations(user.id)
  const calendarDays = await getCalendarDays(user.id)
  const nextLevelExperience = await getUserNextLevelExperience(user.id)
  const experiencePercentage =
    (userGamificationsInformation.currentExperience / nextLevelExperience) * 100

  return (
    <Card className="w-full py-0">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.informations.avatar} alt={user.informations.name} />
            <AvatarFallback>{user.informations.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-lg font-semibold">{user.informations.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Level {userGamificationsInformation.currentLevel}</span>
                {/* <span>•</span>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>#{dummyUser.rank}</span>
                </div> */}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {userGamificationsInformation.currentExperience} / {nextLevelExperience} XP
                </span>
              </div>
              <Progress value={experiencePercentage} className="h-2" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-7">
            {/* Week days headers */}
            <div className="col-span-7 grid grid-cols-7 mb-1">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex justify-center items-center text-xs text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <Tooltip.Provider>
              {calendarDays.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col items-center gap-y-1">
                  {column.map((day, rowIndex) => (
                    <Tooltip.Root key={`${columnIndex}-${rowIndex}`}>
                      <Tooltip.Trigger asChild>
                        <div
                          className={`h-7 w-7 rounded flex items-center justify-center text-xs border cursor-pointer ${
                            day
                              ? day.completedChallenges > 0
                                ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                                : 'bg-muted/10 text-muted-foreground border-muted/20 hover:bg-muted/20'
                              : 'invisible'
                          }`}
                        >
                          {day?.day}
                        </div>
                      </Tooltip.Trigger>
                      {day && (
                        <TooltipContentCustom>
                          {day.completedChallenges} challenge
                          {day.completedChallenges !== 1 ? 's' : ''} completed on {day.date}
                        </TooltipContentCustom>
                      )}
                    </Tooltip.Root>
                  ))}
                </div>
              ))}
            </Tooltip.Provider>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/profile/me`}>View full profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
