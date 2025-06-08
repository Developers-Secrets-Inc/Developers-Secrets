import { Separator } from '@/components/ui/separator'
import { getUserSolutionById, getUserSolutions } from '@/core/challenges/users-solutions'
import { CommentsSection } from '@/core/comments/components/comments-section'
import { commentContexts } from '@/core/comments/types'
import { getUser } from '@/core/user'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { SolutionDetail } from '../../components/solution-detail'
import { getAllChallenges } from '@/core/challenges/challenge-queries'

// This function enables ISR with a 10-minute revalidation period
export const revalidate = 600 // 10 minutes in seconds

export async function generateStaticParams() {
  try {
    // 1. Fetch all challenges to get their slugs
    const challenges = await getAllChallenges()
    if (!challenges || challenges.length === 0) {
      console.warn('generateStaticParams: No challenges found.')
      return []
    }

    // 2. For each challenge, fetch its user solutions to get their IDs
    const params = await Promise.all(
      challenges.map(async (challenge) => {
        if (!challenge.slug || !challenge.id) {
          console.warn(
            `generateStaticParams: Challenge missing slug or ID: ${JSON.stringify(challenge)}`,
          )
          return []
        }
        // Assuming getUserSolutions fetches solutions for a specific challenge
        // Adjust if the function signature is different
        const solutions = await getUserSolutions() // Fetch solutions (potentially filter by challenge.id if needed)
        const solutionsForChallenge = solutions.filter((sol) => sol.challenge === challenge.id)

        return solutionsForChallenge.map((solution) => ({
          challenge_slug: challenge.slug,
          solution_id: solution.id.toString(), // Ensure solution_id is a string
        }))
      }),
    )

    // 3. Flatten the array of paths
    return params.flat().filter((param) => param.challenge_slug && param.solution_id) // Filter out any invalid entries
  } catch (error) {
    console.error('Error in generateStaticParams for solutions:', error)
    return [] // Return empty array on error to prevent build failure
  }
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
  params: { challenge_slug: string; solution_id: string }
}) {
  const { challenge_slug, solution_id } = params
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
