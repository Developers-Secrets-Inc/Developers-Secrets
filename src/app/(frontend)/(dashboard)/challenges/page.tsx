import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ChallengeCategories } from './components/challenge-categories'
import { ChallengesLeaderboard } from './components/challenges-leaderboard'
import { ChallengesTable } from './components/challenges-table'
import { RecommendedChallenge } from './components/recommended-challenge'
import { UserProfile } from './components/user-profile'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
// Remove Payload imports if no longer needed here
// import { getPayload } from 'payload'
// import config from '@payload-config'

export default async function ChallengesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // --- REMOVED TEMPORARY JOB TRIGGER ---
  /*
  try {
    const payload = await getPayload({ config })
    console.log('[ChallengesPage] Attempting to RUN createWeeklyDivisionLeaderboards job via Local API...')
    const jobResult = await payload.jobs.run({
      task: 'createWeeklyDivisionLeaderboards',
      input: {},
    })
    console.log('[ChallengesPage] Finished running createWeeklyDivisionLeaderboards job. Result:', jobResult)
  } catch (error) {
    console.error('[ChallengesPage] Failed to run createWeeklyDivisionLeaderboards job:', error)
  }
  */
  // --- END REMOVED TEMPORARY JOB TRIGGER ---

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
          <div className="flex gap-6 p-6 h-full">
            <div className="flex-1 flex flex-col gap-6">
              <RecommendedChallenge />
              <ChallengeCategories />
              <ChallengesTable userId={user.id} />
            </div>
            <div className="w-[360px] flex flex-col gap-6">
              <UserProfile />
              <ChallengesLeaderboard />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
