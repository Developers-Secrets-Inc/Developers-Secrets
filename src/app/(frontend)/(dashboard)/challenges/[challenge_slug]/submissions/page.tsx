import { getUser } from '@/core/user'
import { SubmissionsList } from '../components/submissions-list'
import { getChallengeBySlug } from '@/core/challenges/challenge-queries'
import { redirect } from 'next/navigation'

export default async function SubmissionsPage({
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
      <div>
        <h3 className="text-lg font-semibold mb-3">Your Submissions</h3>
        <SubmissionsList
          challenge={challenge}
          userId={user.id}
        />
      </div>
    </div>
  )
}
