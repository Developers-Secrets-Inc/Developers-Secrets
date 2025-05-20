import { setUserDailyQuests } from "@/core/gamification/quests/actions"
import { areUserDailyQuestsExpired } from "@/core/gamification/quests/actions"
import { getUser } from "@/core/user"
import { redirect } from "next/navigation"

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (await areUserDailyQuestsExpired(user.id)) {
    await setUserDailyQuests(user.id)
  }

  return <div>{children}</div>
}

export default DashboardLayout

