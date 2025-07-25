import { Challenge, UserChallengeCompletionStatus } from '@/payload-types'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import * as Tooltip from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { CheckCircle2Icon, CircleDotIcon } from 'lucide-react'
import { getChallengeProgression } from '../progression'

export const SimilarChallengesCards = async ({
  challenges,
}: {
  challenges: {
    challenge: Challenge
    completionStatus: { _tag: "none" } | { _tag: "some"; value: UserChallengeCompletionStatus }
    id?: string | null | undefined
  }[]
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Similar Challenges</h3>
      <div className="flex flex-col gap-2">
        {(challenges ?? []).map((challengeItem) => {
          const progressionStatus = challengeItem.completionStatus._tag === "some" 
            ? challengeItem.completionStatus.value.completionStatus 
            : "not_started"
          
          return (
            <SimilarChallengeCard
              key={challengeItem.challenge.id}
              challenge={challengeItem.challenge}
              progression={progressionStatus}
            />
          )
        })}
      </div>
    </div>
  )
}

const ChallengeStatusCell = ({
  progression,
}: {
  progression: UserChallengeCompletionStatus['completionStatus']
}) => {
  return (
    <div className="w-8">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="flex items-center justify-center">
              {progression === 'in_progress' ? (
                <CircleDotIcon className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
              )}
            </div>
          </Tooltip.Trigger>
          <TooltipContentCustom sideOffset={2} align="center">
            {progression === 'in_progress' ? 'In Progress' : 'Completed'}
          </TooltipContentCustom>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}

export const SimilarChallengeCard = ({
  challenge,
  progression,
}: {
  challenge: Challenge
  progression: UserChallengeCompletionStatus['completionStatus']
}) => {
  const difficulty = challenge.difficulty
  const difficultyStyles = {
    very_easy: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500',
    easy: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    medium: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    hard: 'bg-red-500/10 border-red-500/20 text-red-500',
    horrible: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
  }[difficulty]

  return (
    <Link href={`/challenges/${challenge.slug}`} className="block">
      <div className="border rounded-lg p-3 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-colors group relative">
        <div className="flex items-center justify-between">
          <div>
            <ChallengeStatusCell progression={progression} />
            <span className="text-sm font-medium flex-1">{challenge.title}</span>
          </div>
          <Badge className={cn(difficultyStyles)} variant="secondary">
            {difficulty.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        </div>
      </div>
    </Link>
  )
}
