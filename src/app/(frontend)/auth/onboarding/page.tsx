import {
  CurrentLevelCard,
  CurrentExperienceCard,
  GoalsAndTechnologiesCard,
} from '@/core/onboarding/components'
import { notFound } from 'next/navigation'
import { getUser } from '@/core/user'
import { setCodingLevel, setTimeCoding } from '@/core/onboarding'

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
    1: (
      <CurrentLevelCard
        currentStep={Number(step)}
        userId={user.id}
      />
    ),
    2: <CurrentExperienceCard currentStep={Number(step)} userId={user.id} />,
    3: <GoalsAndTechnologiesCard currentStep={Number(step)} userId={user.id} />,
  }

  return stepCards[step] || notFound()
}
