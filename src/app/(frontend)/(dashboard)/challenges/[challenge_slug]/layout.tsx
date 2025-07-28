import { getChallengeBySlug } from '@/api/challenges'
import { ChallengeViewManager } from '@/api/challenges/chat/components/challenge-view-manager'
import { ChallengeSettingsBubble } from '@/api/challenges/components/admin/challenge-settings-bubble'
import { ChallengeExercice } from '@/api/challenges/components/challenge-exercice'
import { ChallengeLayout } from '@/api/challenges/components/sections/layout'
import { ChallengeProvider } from '@/api/challenges/contexts/components/challenge-provider'
import {
  getNextChallenge,
  getPreviousChallenge,
  getRandomChallenge,
} from '@/api/challenges/navigation'
import { ChallengeNavigationTabs } from '@/api/challenges/navigation/components/navigation-tabs'
import { getRemainingMessagesForToday } from '@/core/ai/quotas/actions'
import { getOrCreateChat, loadChat } from '@/core/challenges/ai-chat'
import { ChallengeTimerStarter } from '@/core/challenges/components/challenge-timer-starter'
import { NewCompletionDialog } from '@/core/challenges/components/completion/new-completion-dialog'
import { AdminComponent } from '@/core/user/components/admin-component'
import { getUser } from '@/core/users'
import { isNone, isSome } from '@/lib/maybe'
import { isFailure } from '@/lib/result'
import { Challenge } from '@/payload-types'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

const getCurrencyOnCompletion = (challenge: Challenge): number => {
  const baseExp = challenge.baseExperience ?? 50
  const min = Math.floor(baseExp * 0.5)
  const max = Math.ceil(baseExp * 1.5)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function LoadingPlaceholder() {
  return <div className="animate-pulse p-6 bg-background/50 rounded-md h-[200px]"></div>
}

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

  const exercice = challenge.value.exercice.value

  // ! Should be a new version
  const challengeAIChat = await getOrCreateChat({
    userId: user.value.id,
    challenge: challenge.value.id,
  })

  const [messages, quotas, previousChallenge, nextChallenge, randomChallenge] = await Promise.all([
    loadChat({ chatId: challengeAIChat.id }),
    getRemainingMessagesForToday(user.value.id),
    getPreviousChallenge({ challengeId: challenge.value.id }),
    getNextChallenge({ challengeId: challenge.value.id }),
    getRandomChallenge({ challengeId: challenge.value.id }),
  ])

  if (isNone(previousChallenge) || isNone(nextChallenge) || isNone(randomChallenge))
    throw new Error('Navigation challenges not found')

  return (
    <ChallengeProvider
      key={challenge.value.id}
      challenge={challenge.value}
      metadata={{
        challengeAiChat: challengeAIChat,
        messages,
        quotas,
        completionCurrency: getCurrencyOnCompletion(challenge.value),
      }}
    >
      <ChallengeLayout.Root>
        <ChallengeLayout.Header
          navigationChallenges={{
            previousChallenge: previousChallenge.value,
            nextChallenge: nextChallenge.value,
            randomChallenge: randomChallenge.value,
          }}
        />

        <ChallengeLayout.Body>
          <ChallengeLayout.Content>
            <ChallengeLayout.LeftPart>
              <ChallengeNavigationTabs />
              <ChallengeLayout.MainContainer>
                <ChallengeViewManager>
                  <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
                </ChallengeViewManager>
              </ChallengeLayout.MainContainer>
            </ChallengeLayout.LeftPart>

            <ChallengeLayout.ContentSeparator />

            <ChallengeLayout.RightPart>
              {/* The error is normal, it's because exercices should not be optional but are during the migration */}
              <ChallengeExercice exercice={exercice} />
            </ChallengeLayout.RightPart>
          </ChallengeLayout.Content>
        </ChallengeLayout.Body>
      </ChallengeLayout.Root>
      <AdminComponent>
        <ChallengeSettingsBubble />
      </AdminComponent>
      <ChallengeTimerStarter />
      <NewCompletionDialog userId={user.value.id} challenge={challenge.value} />
    </ChallengeProvider>
  )
}

export default Layout
