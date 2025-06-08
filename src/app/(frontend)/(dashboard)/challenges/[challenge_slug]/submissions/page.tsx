import { getUser } from '@/core/user'
import { SubmissionsList } from '../components/submissions-list'
import { getChallengeBySlug } from '@/core/challenges/challenge-queries'
import { getSubmissions } from '@/core/challenges/submissions'

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ challenge_slug: string }>
}) {
  // Attendre les paramètres avant de les utiliser
  const { challenge_slug } = await params
  const challenge = await getChallengeBySlug(challenge_slug)
  const user = await getUser()

  const submissionsData = await getSubmissions(challenge.id, user.id)

  const initialSubmissions = submissionsData.map((submission) => ({
    id: submission.id.toString(),
    submissionType: submission.submissionType,
    testsPassed: submission.testsPassed,
    testsTotal: submission.testsTotal,
    createdAt: submission.createdAt,
  }))

  return (
    <div className="p-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Your Submissions</h3>
        <SubmissionsList
          challengeId={challenge.id}
          userId={user.id}
          initialSubmissions={initialSubmissions}
        />
      </div>
    </div>
  )
}
