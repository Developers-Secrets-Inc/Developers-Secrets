import { RecommendedChallenge } from '@/core/challenges/recommended-challenge'
import { DevSettingsBubble } from '@/core/dev/components/settings'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ChallengeCategories } from './components/challenge-categories'
import { DivisionLeaderboardCard } from './components/challenges-leaderboard'
import { ChallengesTable, TableSkeleton } from './components/challenges-table'
import { UserProfile, UserProfileCardSkeleton } from './components/user-profile'
import { getTagsLinkInformations } from '@/api/challenges/tags'
import { TagsLists } from '@/api/challenges/tags/components/tags-list'
import { AdminComponent } from '@/core/user/components/admin-component'

export default async function ChallengesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const tags = await getTagsLinkInformations()

  return (
    <>
      <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
        <div className="flex gap-6 p-6 h-full">
          <div className="flex-1 flex flex-col gap-6 max-w-[800px]">
            <RecommendedChallenge userId={user.id} />
            <AdminComponent>
              <TagsLists tags={tags} />
            </AdminComponent>
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
        </div>
      </div>
      <DevSettingsBubble />
    </>
  )
}
