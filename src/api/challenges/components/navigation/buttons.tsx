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
        <Button {...props} variant={'outline'} asChild>
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
    className="rounded-none border-x-0 px-3"
    aria-label="Previous challenge"
    tooltipText="Previous challenge"
  >
    <Link href={`/challenges/${previousChallenge.slug}`} prefetch={true}>
      <ArrowLeft size={16} />
    </Link>
  </ChallengeNavigationButton>
)

export const NextChallengeButton = ({ nextChallenge }: { nextChallenge: Challenge }) => (
  <ChallengeNavigationButton
    className="rounded-l-none border-l-0 px-3"
    aria-label="Next challenge"
    tooltipText="Next challenge"
  >
    <Link href={`/challenges/${nextChallenge.slug}`} prefetch={true}>
      <ArrowRight size={16} />
    </Link>
  </ChallengeNavigationButton>
)

export const RandomChallengeButton = ({ randomChallenge }: { randomChallenge: Challenge }) => (
  <ChallengeNavigationButton
    className="rounded-none border-x-0 px-3"
    aria-label="Random challenge"
    tooltipText="Random challenge"
  >
    <Link href={`/challenges/${randomChallenge.slug}`} prefetch={true}>
      <Shuffle size={16} />
    </Link>
  </ChallengeNavigationButton>
)

export const ListChallengesButton = () => (
  <ChallengeNavigationButton
    className="rounded-r-none border-r-0 px-3"
    aria-label="Back to challenges"
    tooltipText="Back to challenges"
  >
    <Link href="/challenges">
      <List size={16} />
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
  <>
    <ListChallengesButton />
    <PreviousChallengeButton previousChallenge={previousChallenge} />
    <RandomChallengeButton randomChallenge={randomChallenge} />
    <NextChallengeButton nextChallenge={nextChallenge} />
  </>
)
