import { CheckCircle } from 'lucide-react'
import { ChallengeDifficulty } from '@/components/challenges/challenge-difficulty'
import { ChallengeExperience } from '@/components/challenges/challenge-experience'
import { ChallengeConcepts } from '@/components/challenges/challenge-concepts'
import { Challenge as PayloadChallenge } from '@/payload-types'
type ChallengeHeaderProps = {
  challenge: PayloadChallenge
  concepts: string[]
  status?: 'Attempted' | 'Completed' | 'Not Attempted'
}

export const ChallengeHeader = ({
  challenge,
  concepts,
  status = 'Not Attempted',
}: ChallengeHeaderProps) => {
  // Mapping des couleurs par statut
  const statusColorMap = {
    Attempted: 'amber',
    Completed: 'green',
    'Not Attempted': 'gray',
  }

  const statusColor = statusColorMap[status]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{challenge.title}</h2>
        <div className={`flex items-center gap-1.5 text-${statusColor}-500`}>
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{status}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <ChallengeDifficulty difficulty={challenge.difficulty} />
        <ChallengeExperience experience={challenge.baseExperience || 0} />
        <ChallengeConcepts concepts={concepts} />
      </div>
    </>
  )
}
