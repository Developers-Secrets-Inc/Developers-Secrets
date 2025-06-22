import {
  CurrentExperienceCard,
  CurrentLevelCard,
  GoalsAndTechnologiesCard,
} from '@/core/onboarding/components'
import { getUser } from '@/core/user'
import { notFound } from 'next/navigation'

// Import necessary components for the button and tooltip
import { DialogTooltip } from './components/dialog-tooltip'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step: number }>
}) {
  const { step } = await searchParams
  const user = await getUser()

  if (!user) {
    return notFound() // TODO: Redirect to login page (/auth/login || /auth/signup)
  }

  const stepCards: Record<number, React.ReactNode> = {
    1: <CurrentLevelCard currentStep={Number(step)} userId={user.id} />,
    2: <CurrentExperienceCard currentStep={Number(step)} userId={user.id} />,
    3: <GoalsAndTechnologiesCard currentStep={Number(step)} userId={user.id} />,
  }

  return (
    <>
      <DialogTooltip userId={user.id} />
      {stepCards[step] || notFound()}
    </>
  )
}
