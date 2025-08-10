import {
  CurrentExperienceCard,
  CurrentLevelCard,
  GoalsAndTechnologiesCard,
} from '@/core/onboarding/components'
import { getUser } from '@/core/users'
import { notFound, redirect } from 'next/navigation'
import { isFailure } from '@/lib/result'

import { DialogTooltip } from './components/dialog-tooltip'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step: number }>
}) {
  const { step } = await searchParams
  const user = await getUser()

  if (isFailure(user)) {
    return redirect('/auth/login') // TODO: Redirect to login page (/auth/login || /auth/signup)
  }

  const stepCards: Record<number, React.ReactNode> = {
    1: <CurrentLevelCard currentStep={Number(step)} userId={user.value.id} />,
    2: <CurrentExperienceCard currentStep={Number(step)} userId={user.value.id} />,
    3: <GoalsAndTechnologiesCard currentStep={Number(step)} userId={user.value.id} />,
  }

  return (
    <>
      <DialogTooltip userId={user.value.id} />
      {stepCards[step] || notFound()}
    </>
  )
}
