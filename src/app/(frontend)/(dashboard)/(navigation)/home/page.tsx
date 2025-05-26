import { Suspense } from 'react'

import { DivisionLeaderboardCard } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/challenges-leaderboard'
import {
  RecommendedChallenge,
  RecommendedChallengeSkeleton,
} from '@/core/challenges/recommended-challenge'
import {
  UserProfile,
  UserProfileCardSkeleton,
} from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/user-profile'
import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import {
  RecommendedCourses,
  RecommendedCoursesSkeleton,
} from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/recommended-courses'

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
        <Suspense fallback={<RecommendedChallengeSkeleton />}>
          <RecommendedChallenge userId={user.id} />
        </Suspense>

        <CurrentCourseCard />

        <Suspense fallback={<RecommendedCoursesSkeleton />}>
          <RecommendedCourses />
        </Suspense>
      </HomeLeftColumn>

      <HomeRightColumn>
        <Suspense fallback={<UserProfileCardSkeleton />}>
          <UserProfile user={user} />
        </Suspense>
        <DivisionLeaderboardCard />
      </HomeRightColumn>
    </HomeGrid>
  )
}
