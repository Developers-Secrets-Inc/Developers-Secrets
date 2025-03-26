import { ChallengeHeader } from '../components/challenge-header'
import { SubmissionsList } from '../components/submissions-list'

export default async function SubmissionsPage({ params }: { params: Promise<{ challenge_slug: string }> }) {
  // Attendre les paramètres avant de les utiliser
  const { challenge_slug } = await params

  return (
    <div className="p-6">
      <ChallengeHeader />
      <div>
        <h3 className="text-lg font-semibold mb-3">Your Submissions</h3>
        <SubmissionsList />
      </div>
    </div>
  )
} 