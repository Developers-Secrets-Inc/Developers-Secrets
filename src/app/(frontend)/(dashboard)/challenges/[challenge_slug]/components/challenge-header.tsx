import { Circle, CircleDot, CheckCircle } from 'lucide-react'
import { Difficulty } from '@/components/challenges/challenge-difficulty'
import { Experience } from '@/components/challenges/challenge-experience'
import { Concepts } from '@/components/challenges/challenge-concepts'
import { Challenge as PayloadChallenge } from '@/payload-types'
import { CompletionStatus } from '@/core/challenges/user-progression/types'

type ChallengeHeaderProps = {
  challenge: PayloadChallenge
  status?: CompletionStatus
}

export const ChallengeHeader = ({ challenge, status = 'not_started' }: ChallengeHeaderProps) => {
  // Status configuration
  const statusConfig: Record<
    CompletionStatus,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    completed: {
      icon: <CheckCircle size={16} />,
      color: 'green',
      label: 'Completed',
    },
    in_progress: {
      icon: <CircleDot size={16} />,
      color: 'amber',
      label: 'In Progress',
    },
    not_started: {
      icon: <Circle size={16} />,
      color: 'gray',
      label: 'Not Started',
    },
  }

  const { icon, color, label } = statusConfig[status]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{challenge.title}</h2>
        <div className={`flex items-center gap-1.5 text-${color}-500`}>
          {icon}
          <span className="text-sm font-medium">{label}</span>
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
