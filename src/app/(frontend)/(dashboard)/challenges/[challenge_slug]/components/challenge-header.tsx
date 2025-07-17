import { Difficulty } from '@/components/challenges/challenge-difficulty'
import { Experience } from '@/components/challenges/challenge-experience'

import { Challenge as PayloadChallenge } from '@/payload-types'
import { ChallengeStatus } from './challenge-status'
import { Badge } from '@/components/ui/badge'

type ChallengeHeaderProps = {
  challenge: PayloadChallenge
}

export const ChallengeHeader = ({ challenge }: ChallengeHeaderProps) => {
  return (
    <div className="mb-6 border-b pb-4">
      <div className="flex justify-between items-center mb-4">
        <ChallengeTitle title={challenge.title} />
        <div className="flex items-center gap-2">
          {challenge.draft && <Badge variant="secondary">Draft</Badge>}
          <ChallengeStatus challengeId={challenge.id} />
        </div>
      </div>
      <ChallengeHeaderTags challenge={challenge} />
    </div>
  )
}

const ChallengeHeaderTags = ({ challenge }: { challenge: PayloadChallenge }) => {
  const conceptsList =
    challenge.concepts
      ?.map((concept: any) => (typeof concept === 'object' ? concept.concept : concept))
      .filter(Boolean) || []

  return (
    <div className="flex justify-between items-center flex-wrap mb-4">
      <div className="flex flex-wrap gap-2">
        <Difficulty difficulty={challenge.difficulty} />
        <Experience quantity={challenge.baseExperience || 0} />
      </div>
    </div>
  )
}



type ChallengeTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  title: string
}

const ChallengeTitle = ({ title, className, ...props }: ChallengeTitleProps) => {
  return <h2 className={`text-2xl font-semibold ${className}`} {...props}>{title}</h2>
}
