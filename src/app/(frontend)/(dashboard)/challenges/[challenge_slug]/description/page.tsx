import { getAllChallengesSlugs, getChallengeBySlug } from '@/core/challenges'
import { ChallengeHeader } from '../components/challenge-header'
import { ChallengeDescriptionContent } from './components/challenge-description-content'
import { ChallengeDescriptionFooter } from './components/challenge-description-footer'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { getUser } from '@/core/user'
import { getUserCompletionStatus } from '@/core/challenges/user-progression'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // 10 minutes in seconds

export async function generateStaticParams() {
  const slugs = await getAllChallengesSlugs()
  return slugs.map((slug: string) => ({
    challenge_slug: slug,
  }))
}

export default async function ChallengeDescriptionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params

  try {
    const challenge = await getChallengeBySlug(challenge_slug)
    const user = await getUser()

    if (!user) {
      return (
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to view this challenge.</p>
          </div>
        </div>
      )
    }

    // Get the completion status for this challenge
    const status = await getUserCompletionStatus(user.id, challenge.id)

    return (
      <div className="p-6">
        <Suspense fallback={<ChallengeDescriptionSkeleton />}>
          <ChallengeHeader challenge={challenge} status={status} />
          <ChallengeDescriptionContent
            descriptionStatement={challenge.description?.statement || 'No description available.'}
          />
        </Suspense>
        <Suspense fallback={<ChallengeDescriptionFooterSkeleton />}>
          <ChallengeDescriptionFooter challenge={challenge} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return <ChallengeNotFound challengeSlug={challenge_slug} />
  }
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

const ChallengeDescriptionFooterSkeleton = () => {
  return (
    <div className="mt-8 border-t pt-6">
      <Skeleton className="h-6 w-24 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )
}

const ChallengeNotFound = ({ challengeSlug }: { challengeSlug: string }) => {
  return (
    <div>
      <h1>Challenge not found</h1>
      <p>The challenge with slug {challengeSlug} was not found.</p>
    </div>
  )
}
