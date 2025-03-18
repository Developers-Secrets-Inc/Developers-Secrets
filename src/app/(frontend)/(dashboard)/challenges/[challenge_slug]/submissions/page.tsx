import { ChallengeHeader } from '../components/challenge-header'
import { SubmissionsList } from '../components/submissions-list'

export default function SubmissionsPage({ params }: { params: { challenge_slug: string } }) {
  return (
    <div>
      <ChallengeHeader />
      <div>
        <h3 className="text-lg font-semibold mb-3">Your Submissions</h3>
        <SubmissionsList />
      </div>
    </div>
  )
} 