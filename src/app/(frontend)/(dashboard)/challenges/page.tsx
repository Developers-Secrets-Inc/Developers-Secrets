import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ChallengeCategories } from './components/challenge-categories'
import { DivisionLeaderboardCard } from './components/challenges-leaderboard'
import { ChallengesTable, TableSkeleton } from './components/challenges-table'
import { RecommendedChallenge } from './components/recommended-challenge'
import { UserProfile, UserProfileCardSkeleton } from './components/user-profile'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
// Remove Payload imports if no longer needed here
// import { getPayload } from 'payload'
// import config from '@payload-config'
import { LearningPathCarousel } from './components/learning-path-carousel'
import { DevSettingsBubble } from '@/core/dev/components/settings'
import NewChallengesTable from './components/new-challenges-table'

export default async function ChallengesPage() {
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
            <div className="flex-1 flex flex-col gap-6 max-w-[800px]">
              <RecommendedChallenge />
              {/* {process.env.NODE_ENV === 'development' && <LearningPathCarousel />} */}
              <ChallengeCategories />
              <Suspense fallback={<TableSkeleton />}>
                <ChallengesTable userId={user.id} />
              </Suspense>
              <Suspense fallback={<TableSkeleton />}>
                <NewChallengesTable />
              </Suspense>
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
      <DevSettingsBubble />
    </SidebarProvider>
  )
}
