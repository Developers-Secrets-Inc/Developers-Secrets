import { getAllChallengesSlugs, getChallengeBySlug } from '@/core/challenges/challenge-queries'
import { ChallengeHeader } from '../components/challenge-header'
import { OfficialSolutionComments } from '../components/comments/official-solution-comments'
import { SolutionContent } from './components/solution-content'
import { getUserCompletionStatus } from '@/core/challenges/user-progression'
import { getUser } from '@/core/users'
import { redirect } from 'next/navigation'
import { canAccessSolution } from '@/core/challenges/user-progression/completion-status'
import { isFailure } from '@/lib/result'

export default async function OfficialSolutionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params

  const challenge = await getChallengeBySlug(challenge_slug)
  const user = await getUser()

  if (isFailure(user)) {
    redirect('/auth/login')
  }

  const isSolutionUnlocked = await canAccessSolution(user.value.id, challenge.id)

  if (!isSolutionUnlocked) {
    redirect(`/challenges/${challenge_slug}/description`)
  }


  return (
    <div className="p-6">
      <ChallengeHeader
        challenge={challenge}
      />
      <SolutionContent
        slug={challenge_slug}
        initialSolution={challenge.officialSolution?.statement || 'No official solution available.'}
      />

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <OfficialSolutionComments challenge={challenge} />
      </div>
    </div>
  )
}
