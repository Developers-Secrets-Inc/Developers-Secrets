import { getChallengeBySlug } from '@/api/challenges'
import { getUser } from '@/core/users'
import { isNone, isSome } from '@/lib/maybe'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ChallengeDescriptionContent } from '../../../challenges/[challenge_slug]/description/components/challenge-description-content'
import { ChallengeHeader } from '../../../challenges/[challenge_slug]/components/challenge-header'
import { Skeleton } from '@/components/ui/skeleton'
import { SimilarChallengesCards } from '@/api/challenges/components/similar-challenges'

export default async function Page({ params }: { params: Promise<{ challenge_slug: string }> }) {
  const { challenge_slug } = await params

  const challenge = await getChallengeBySlug({ slug: challenge_slug })
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (isNone(challenge) || (isSome(challenge) && challenge.value.draft)) {
    return notFound()
  }

  return (
    <div className="p-6">
      <Suspense fallback={<ChallengeDescriptionSkeleton />}>
        <ChallengeHeader challenge={challenge.value} />
        <ChallengeDescriptionContent
          slug={challenge_slug}
          initialDescription={challenge.value.description?.statement || 'No description available.'}
        />
        <div className="mt-8">
          <SimilarChallengesCards challenges={challenge.value.description.similarChallenges} />
        </div>
      </Suspense>
      {/* <Suspense fallback={<ChallengeDescriptionFooterSkeleton />}>
          <ChallengeDescriptionFooter challenge={challenge} />
        </Suspense> */}
    </div>
  )
}

const ChallengeDescriptionSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}
