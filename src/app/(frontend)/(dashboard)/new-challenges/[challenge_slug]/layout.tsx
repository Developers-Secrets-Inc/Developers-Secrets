import { getChallengeBySlug } from '@/api/challenges'
import { ChallengeExercice } from '@/api/challenges/components/challenge-exercice'
import { ChallengeLayout } from '@/api/challenges/components/sections/layout'
import { ChallengeProvider } from '@/api/challenges/contexts/components/challenge-provider'
import { ChallengeNavigationTabs } from '@/api/challenges/navigation/components/navigation-tabs'
import { getUser } from '@/core/users'
import { isNone, isSome } from '@/lib/maybe'
import { isFailure } from '@/lib/result'
import { notFound, redirect } from 'next/navigation'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ challenge_slug: string }>
}) => {
  const { challenge_slug } = await params
  const [challenge, user] = await Promise.all([
    getChallengeBySlug({ slug: challenge_slug }),
    getUser(),
  ])

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  if (isNone(challenge) || (isSome(challenge) && challenge.value.draft)) {
    return notFound()
  }

  return (
    <ChallengeProvider challenge={challenge.value}>
      <ChallengeLayout.Root>
        <ChallengeLayout.Header />

        <ChallengeLayout.Body>
          <ChallengeLayout.Content>
            <ChallengeLayout.LeftPart>
              <ChallengeNavigationTabs />
              {children}
            </ChallengeLayout.LeftPart>

            <ChallengeLayout.ContentSeparator />

            <ChallengeLayout.RightPart>
              <ChallengeExercice />
            </ChallengeLayout.RightPart>
          </ChallengeLayout.Content>
        </ChallengeLayout.Body>
      </ChallengeLayout.Root>
    </ChallengeProvider>
  )
}

export default Layout
