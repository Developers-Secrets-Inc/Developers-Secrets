import {
  CurrentLevelCard,
  CurrentExperienceCard,
  GoalsAndTechnologiesCard,
} from '@/core/onboarding/components'
import { notFound } from 'next/navigation'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step: number }>
}) {
  const { step } = await searchParams
  const stepCards: Record<number, React.ReactNode> = {
    1: <CurrentLevelCard currentStep={Number(step)} />,
    2: <CurrentExperienceCard currentStep={Number(step)} />,
    3: <GoalsAndTechnologiesCard currentStep={Number(step)} />,
  }

  return stepCards[step] || notFound()
}
