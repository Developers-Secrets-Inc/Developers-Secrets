import { Separator } from '@/components/ui/separator'
import { getUserSolutionById } from '@/core/challenges/users-solutions'
import { CommentsSection } from '@/core/comments/components/comments-section'
import { commentContexts } from '@/core/comments/types'
import { getUser } from '@/core/user'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { SolutionDetail } from '../../components/solution-detail'
import { getAllSolutions } from '@/lib/challenge-utils'

// This function enables ISR with a 10-minute revalidation period
export const revalidate = 600 // 10 minutes in seconds

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params
  const solutions = await getAllSolutions(challenge_slug)
  return solutions.map((solution) => ({
    solution_id: solution.id,
    challenge_slug,
  }))
}

// Composant de chargement optimisé
function SolutionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse -mt-6">
      <div className="flex items-center justify-between py-2 border-b -mx-6 px-6">
        <div className="h-8 w-32 bg-muted rounded"></div>
        <div className="h-8 w-32 bg-muted rounded"></div>
      </div>
      <div>
        <div className="h-8 w-3/4 bg-muted rounded mb-2"></div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-full bg-muted"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
        <div className="h-4 w-full bg-muted rounded mb-4"></div>
      </div>
      <div className="h-64 bg-muted rounded"></div>
    </div>
  )
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ challenge_slug: string; solution_id: string }>
}) {
  const { challenge_slug, solution_id } = await params
  const solution = await getUserSolutionById(solution_id)
  const user = await getUser()
  if (!solution) {
    notFound()
  }

  return (
    <div className="p-6">
      <Suspense fallback={<SolutionSkeleton />}>
        <SolutionDetail solution={solution} challengeSlug={challenge_slug} />
      </Suspense>
      <Separator className="my-6" />
      <CommentsSection context={commentContexts.userSolution(solution.id)} userId={user.id} />
    </div>
  )
}
