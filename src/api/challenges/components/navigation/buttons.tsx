import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Button, ButtonProps } from '@/components/ui/button'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, Shuffle, List } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

// Types
export type Challenge = {
  slug: string
}

// Generic navigation button with tooltip
export type ChallengeNavigationButtonProps = ButtonProps & {
  tooltipText: string
  children: ReactNode
}

const ChallengeNavigationButton = ({
  tooltipText,
  children,
  ...props
}: ChallengeNavigationButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          {...props} 
          variant="outline" 
          size="icon"
          className="size-9 rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          asChild
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContentCustom side="bottom">{tooltipText}</TooltipContentCustom>
    </Tooltip>
  )
}

export const PreviousChallengeButton = ({
  previousChallenge,
}: {
  previousChallenge: Challenge
}) => (
  <ChallengeNavigationButton
    aria-label="Previous challenge"
    tooltipText="Previous challenge"
  >
    <Link href={`/challenges/${previousChallenge.slug}/description`}>
      <ArrowLeft size={16} aria-hidden="true" />
    </Link>
  </ChallengeNavigationButton>
)

export const NextChallengeButton = ({ nextChallenge }: { nextChallenge: Challenge }) => (
  <ChallengeNavigationButton
    aria-label="Next challenge"
    tooltipText="Next challenge"
  >
    <Link href={`/challenges/${nextChallenge.slug}/description`}>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  </ChallengeNavigationButton>
)

export const RandomChallengeButton = ({ randomChallenge }: { randomChallenge: Challenge }) => (
  <ChallengeNavigationButton
    aria-label="Random challenge"
    tooltipText="Random challenge"
  >
    <Link href={`/challenges/${randomChallenge.slug}/description`}>
      <Shuffle size={16} aria-hidden="true" />
    </Link>
  </ChallengeNavigationButton>
)

export const ListChallengesButton = () => (
  <ChallengeNavigationButton
    aria-label="Back to challenges"
    tooltipText="Back to challenges"
  >
    <Link href="/challenges">
      <List size={16} aria-hidden="true" />
    </Link>
  </ChallengeNavigationButton>
)

export const ChallengeNavigationButtons = ({
  previousChallenge,
  nextChallenge,
  randomChallenge,
}: {
  previousChallenge: Challenge
  nextChallenge: Challenge
  randomChallenge: Challenge
}) => (
  <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
    <ListChallengesButton />
    <PreviousChallengeButton previousChallenge={previousChallenge} />
    <RandomChallengeButton randomChallenge={randomChallenge} />
    <NextChallengeButton nextChallenge={nextChallenge} />
  </div>
)
