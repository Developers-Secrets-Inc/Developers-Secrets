import { RecommendedChallenge } from '@/core/challenges/recommended-challenge'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ChallengeCategories } from './components/challenge-categories'
import { DivisionLeaderboardCard } from './components/challenges-leaderboard'
import { ChallengesTable, TableSkeleton } from './components/challenges-table'
import { UserProfile, UserProfileCardSkeleton } from './components/user-profile'
import { DevSettingsBubble } from '@/core/dev/components/settings'
import { getRandomChallengeId } from '@/api/challenges/recommandations'



export default async function ChallengesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  console.log("Here's a random challenge", await getRandomChallengeId())

  return (
    <>
      <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
        <div className="flex gap-6 p-6 h-full">
          <div className="flex-1 flex flex-col gap-6 max-w-[800px]">
            <RecommendedChallenge userId={user.id} />
            {/* {process.env.NODE_ENV === 'development' && <LearningPathCarousel />} */}
            <ChallengeCategories />
            <Suspense fallback={<TableSkeleton />}>
              <ChallengesTable userId={user.id} />
            </Suspense>
          </div>
          <div className="w-[360px] flex flex-col gap-6">
            <Suspense fallback={<UserProfileCardSkeleton />}>
              <UserProfile user={user} />
            </Suspense>
            <DivisionLeaderboardCard />
          </div>
      {/* <QuestCompletionSonner /> */}

        </div>
      </div>
      <DevSettingsBubble />
    </>
  )
}
