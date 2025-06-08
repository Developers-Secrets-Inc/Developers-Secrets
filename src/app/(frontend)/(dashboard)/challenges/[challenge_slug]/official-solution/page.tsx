import { getAllChallengesSlugs, getChallengeBySlug } from '@/core/challenges/challenge-queries'
import { ChallengeHeader } from '../components/challenge-header'
import { OfficialSolutionComments } from '../components/comments/official-solution-comments'
import { SolutionContent } from './components/solution-content'
import { getUserCompletionStatus } from '@/core/challenges/user-progression'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'

export const revalidate = 600 // 10 minutes in seconds

export async function generateStaticParams() {
  const slugs = await getAllChallengesSlugs()
  return slugs.map((slug: string) => ({
    challenge_slug: slug,
  }))
}

export default async function OfficialSolutionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params

  const challenge = await getChallengeBySlug(challenge_slug)
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
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
