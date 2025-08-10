import { CommunitySolutions } from '@/core/challenges/users-solutions/components/solutions/community-solutions'
import { NoSolutionsAvailable } from '@/core/challenges/users-solutions/components/no-solutions-available'
import { CreateSolutionBanner } from '@/core/challenges/users-solutions/components/create-solution-banner'
import { getChallengeSolutions } from '@/core/challenges/users-solutions'
import { getChallengeBySlug } from '@/core/challenges/challenge-queries'
import { Suspense } from 'react'
import { getUser } from '@/core/users'
import { redirect } from 'next/navigation'
import { canAccessSolution } from '@/core/challenges/user-progression/completion-status'
import { isFailure } from '@/lib/result'
// Ajoutons la configuration ISR pour cette page
export const revalidate = 600 // 10 minutes en secondes

// Composant de chargement pour éviter les flashs UI
function SolutionsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-60 bg-muted rounded mb-6"></div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  )
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params
  const challenge = await getChallengeBySlug(challenge_slug)
  const solutions = await getChallengeSolutions(challenge.id)
  const hasSolutions = solutions && solutions.length > 0
  const user = await getUser()

  if (isFailure(user)) {
    redirect('/auth/login')
  }

  const isSolutionUnlocked = await canAccessSolution(user.value.id, challenge.id)

  if (!isSolutionUnlocked) {
    redirect(`/challenges/${challenge_slug}/description`)
  }

  if (!hasSolutions) {
    return (
      <div className="p-6">
        <CreateSolutionBanner challengeId={challenge.id} userId={user.value.id} />
        <NoSolutionsAvailable />
      </div>
    )
  }

  return (
    <div className="p-6">
      <CreateSolutionBanner challengeId={challenge.id} userId={user.value.id} />
      <Suspense fallback={<SolutionsLoading />}>
        <CommunitySolutions challengeSlug={challenge_slug} solutions={solutions} user={user.value} />
      </Suspense>
    </div>
  )
}
