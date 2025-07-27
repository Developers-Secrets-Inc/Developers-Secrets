import { setUserDailyQuests } from '@/core/gamification/quests/actions'
import { areUserDailyQuestsExpired } from '@/core/gamification/quests/actions'
import { getUser } from '@/core/users'
import { redirect } from 'next/navigation'
import { TrackDailyEntry } from '@/core/gamification/streaks/login-entries/components/track-daily-entry'
import { UserProvider } from '@/core/users/contexts/components/user-provider'
import { isFailure } from '@/lib/result'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser()

  if (isFailure(user)) {
    redirect('/auth/login')
  }

  if (await areUserDailyQuestsExpired(user.value.id)) {
    await setUserDailyQuests(user.value.id)
  }

  return (
    <TrackDailyEntry userId={user.value.id}>
      <UserProvider user={user.value}>{children}</UserProvider>
    </TrackDailyEntry>
  )
}

export default DashboardLayout
