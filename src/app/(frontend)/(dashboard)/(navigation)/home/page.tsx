import { DivisionLeaderboardCard } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/challenges-leaderboard'
import { RecommendedCourses } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/recommended-courses'
import { UserProfile } from '@/app/(frontend)/(dashboard)/(navigation)/challenges/components/user-profile'
import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { RecommendedChallenge } from '@/core/challenges/recommended-challenge'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { HomeClientWrapper } from './components/home-client-wrapper'
import { withOnboardingStep } from '@/core/onboarding/tour/components/withOnboardingStep'

const OnboardedCurrentCourseCard = withOnboardingStep(CurrentCourseCard, { stepId: 'current-course' })

export const HomeGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 p-6 h-full">{children}</div>
    </div>
  )
}

export const HomeLeftColumn = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 flex flex-col gap-6 max-w-full lg:max-w-[800px]">{children}</div>
}

export const HomeRightColumn = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-6">{children}</div>
}

export default async function Home() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <HomeClientWrapper>
      <HomeGrid>
        <HomeLeftColumn>
          <OnboardedCurrentCourseCard />
          <RecommendedChallenge userId={user.id} isPro={user.informations.role !== 'basic'} />
          <RecommendedCourses />
        </HomeLeftColumn>

        <HomeRightColumn>
          <UserProfile user={user} />
          <DivisionLeaderboardCard />
        </HomeRightColumn>
      </HomeGrid>
    </HomeClientWrapper>
  )
}
