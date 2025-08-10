import { RecommendedChallenge } from '@/core/challenges/recommended-challenge'
import { DevSettingsBubble } from '@/core/dev/components/settings'
import { getUser } from '@/core/users'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ChallengeCategories } from './components/challenge-categories'
import { DivisionLeaderboardCard } from './components/challenges-leaderboard'
import { ChallengesTable, TableSkeleton } from './components/challenges-table'
import { UserProfile, UserProfileCardSkeleton } from './components/user-profile'
import { getTagsLinkInformations } from '@/api/challenges/tags'
import { TagsLists } from '@/api/challenges/tags/components/tags-list'
import { AdminComponent } from '@/core/users/components/admin-component'
import { isFailure } from '@/lib/result'

export default async function ChallengesPage() {
  const user = await getUser()

  if (isFailure(user)) {
    redirect('/auth/login')
  }

  const tags = await getTagsLinkInformations()

  return (
    <>
      <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 p-6 h-full">
          <div className="flex-1 flex flex-col gap-6 max-w-full lg:max-w-[800px]">
            <RecommendedChallenge
              userId={user.value.id}
              isPro={user.value.informations.role != 'basic'}
            />
            <AdminComponent>
              <TagsLists tags={tags} />
            </AdminComponent>
            <ChallengeCategories />
            <Suspense fallback={<TableSkeleton />}>
              <ChallengesTable
                userId={user.value.id}
                isPro={user.value.informations.role != 'basic'}
              />
            </Suspense>
          </div>
          <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-6">
            <Suspense fallback={<UserProfileCardSkeleton />}>
              <UserProfile user={user.value} />
            </Suspense>
            <DivisionLeaderboardCard />
          </div>
        </div>
      </div>
      <DevSettingsBubble />
    </>
  )
}
