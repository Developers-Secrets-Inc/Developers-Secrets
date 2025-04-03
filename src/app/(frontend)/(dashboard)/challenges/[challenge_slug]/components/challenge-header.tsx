import { CheckCircle } from 'lucide-react'
import { Difficulty } from '@/components/challenges/challenge-difficulty'
import { Experience } from '@/components/challenges/challenge-experience'
import { Concepts } from '@/components/challenges/challenge-concepts'
import { Challenge as PayloadChallenge } from '@/payload-types'

type ChallengeHeaderProps = {
  challenge: PayloadChallenge
  status?: 'Attempted' | 'Completed' | 'Not Attempted'
}

export const ChallengeHeader = ({ challenge, status = 'Not Attempted' }: ChallengeHeaderProps) => {
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
      <ChallengeHeaderTags challenge={challenge} />
    </>
  )
}

const ChallengeHeaderTags = ({ challenge }: { challenge: PayloadChallenge }) => {
  const conceptsList =
    challenge.concepts
      ?.map((concept: any) => (typeof concept === 'object' ? concept.concept : concept))
      .filter(Boolean) || []

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Difficulty difficulty={challenge.difficulty} />
      <Experience quantity={challenge.baseExperience || 0} />
      <Concepts concepts={conceptsList} />
    </div>
  )
}
