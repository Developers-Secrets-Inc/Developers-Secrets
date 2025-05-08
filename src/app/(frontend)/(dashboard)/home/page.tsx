import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getUser } from '@/core/user'
import {
  UserProfile,
  UserProfileCardSkeleton,
} from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/user-profile'
import { DivisionLeaderboardCard } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/challenges-leaderboard'
import { RecommendedChallenge } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/recommended-challenge'

export default async function Home() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
          <div className="flex gap-6 p-6 h-full">
            <div className="flex-1 flex flex-col gap-6 w-[800px]">
              <RecommendedChallenge />
              <CurrentCourseCard />
            </div>
            <div className="w-[360px] flex flex-col gap-6">
              <Suspense fallback={<UserProfileCardSkeleton />}>
                <UserProfile user={user} />
              </Suspense>
              <DivisionLeaderboardCard />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
