import { Circle, CircleDot, CheckCircle } from 'lucide-react'
import { Difficulty } from '@/components/challenges/challenge-difficulty'
import { Experience } from '@/components/challenges/challenge-experience'
import { Concepts } from '@/components/challenges/challenge-concepts'
import { Challenge as PayloadChallenge } from '@/payload-types'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { ChallengeStatus } from './challenge-status'

type ChallengeHeaderProps = {
  challenge: PayloadChallenge
  status?: CompletionStatus
}

export const ChallengeHeader = ({ challenge, status = 'not_started' }: ChallengeHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{challenge.title}</h2>
        <ChallengeStatus />
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
