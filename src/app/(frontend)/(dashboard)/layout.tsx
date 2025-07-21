import { setUserDailyQuests } from '@/core/gamification/quests/actions'
import { areUserDailyQuestsExpired } from '@/core/gamification/quests/actions'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { TrackDailyEntry } from '@/core/gamification/streaks/login-entries/components/track-daily-entry'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (await areUserDailyQuestsExpired(user.id)) {
    await setUserDailyQuests(user.id)
  }

  return <TrackDailyEntry userId={user.id}>{children}</TrackDailyEntry>
}

export default DashboardLayout
