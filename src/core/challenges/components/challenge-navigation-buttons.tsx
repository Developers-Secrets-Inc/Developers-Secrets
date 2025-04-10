import { Button, ButtonProps } from '@/components/ui/button'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, Shuffle, List } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'
import { getNextChallenge, getPreviousChallenge, getRandomChallenge } from '..'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'

interface NavigationButtonProps extends ButtonProps {
  tooltipText: string
  children: ReactNode
}

const NavigationButton = ({ tooltipText, children, ...props }: NavigationButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...props}>{children}</Button>
      </TooltipTrigger>
      <TooltipContentCustom side="bottom">{tooltipText}</TooltipContentCustom>
    </Tooltip>
  )
}

const ListChallengesButton = () => {
  return (
    <NavigationButton
      variant="outline"
      className="rounded-r-none border-r-0 px-3"
      aria-label="Back to challenges"
      tooltipText="Back to challenges"
      asChild
    >
      <Link href="/challenges">
        <List size={16} />
      </Link>
    </NavigationButton>
  )
}

const PreviousChallengeButton = async ({
  currentChallengeSlug,
}: {
  currentChallengeSlug: string
}) => {
  const previousChallenge = await getPreviousChallenge(currentChallengeSlug)

  return (
    <NavigationButton
      variant="outline"
      className="rounded-none border-x-0 px-3"
      aria-label="Previous challenge"
      tooltipText="Previous challenge"
      asChild
    >
      <Link href={`/challenges/${previousChallenge.slug}`} prefetch={true}>
        <ArrowLeft size={16} />
      </Link>
    </NavigationButton>
  )
}

const NextChallengeButton = async ({ currentChallengeSlug }: { currentChallengeSlug: string }) => {
  const nextChallenge = await getNextChallenge(currentChallengeSlug)

  return (
    <NavigationButton
      variant="outline"
      className="rounded-l-none border-l-0 px-3"
      aria-label="Next challenge"
      tooltipText="Next challenge"
      asChild
    >
      <Link href={`/challenges/${nextChallenge.slug}`} prefetch={true}>
        <ArrowRight size={16} />
      </Link>
    </NavigationButton>
  )
}

const RandomChallengeButton = async () => {
  const randomChallenge = await getRandomChallenge()

  return (
    <NavigationButton
      variant="outline"
      className="rounded-none border-x-0 px-3"
      aria-label="Random challenge"
      tooltipText="Random challenge"
      asChild
    >
      <Link href={`/challenges/${randomChallenge.slug}`}>
        <Shuffle size={16} />
      </Link>
    </NavigationButton>
  )
}

export const ChallengeNavigationButtons = ({
  currentChallengeSlug,
}: {
  currentChallengeSlug: string
}) => {
  return (
    <>
      <ListChallengesButton />
      <PreviousChallengeButton currentChallengeSlug={currentChallengeSlug} />
      <RandomChallengeButton />
      <NextChallengeButton currentChallengeSlug={currentChallengeSlug} />
    </>
  )
}
