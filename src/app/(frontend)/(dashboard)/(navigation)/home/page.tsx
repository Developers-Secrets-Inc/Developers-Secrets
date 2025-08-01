
import { DivisionLeaderboardCard } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/challenges-leaderboard'
import { RecommendedCourses } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/recommended-courses'
import { UserProfile } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/user-profile'
import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { RecommendedChallenge } from '@/core/challenges/recommended-challenge'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'

export const HomeGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
      <div className="flex gap-6 p-6 h-full">{children}</div>
    </div>
  )
}

export const HomeLeftColumn = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 flex flex-col gap-6 w-[800px]">{children}</div>
}

export const HomeRightColumn = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-[360px] flex flex-col gap-6">{children}</div>
}

export default async function Home() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <HomeGrid>
      <HomeLeftColumn>
        <CurrentCourseCard />
        <RecommendedChallenge userId={user.id} />
        <RecommendedCourses />
      </HomeLeftColumn>

      <HomeRightColumn>
        <UserProfile user={user} />
        <DivisionLeaderboardCard />
      </HomeRightColumn>
    </HomeGrid>
  )
}
