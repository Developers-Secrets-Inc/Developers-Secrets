import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { getOrCreateChat, loadChat } from '@/core/challenges/ai-chat'
import { getChallengeBySlug } from '@/core/challenges/challenge-queries'
import { ChallengeSettingsBubble } from '@/core/challenges/components/admin/challenge-settings-bubble'
import { ChallengeStatusProvider } from '@/core/challenges/components/challenge-status-provider'
import { ChallengeStoreHydrator } from '@/core/challenges/components/challenge-store-hydrator'
import { ChallengeTimerStarter } from '@/core/challenges/components/challenge-timer-starter'
import { ChallengeViewManager } from '@/core/challenges/components/challenge-view-manager'
import { NewCompletionDialog } from '@/core/challenges/components/completion/new-completion-dialog'
import { ChallengeNavigation } from '@/core/challenges/components/navigation/challenge-navigation'
import { ChallengeProvider } from '@/core/challenges/contexts/challenge-context'
import { ChallengeEditorProvider } from '@/core/challenges/contexts/challenge-editor-context'
import {
  getUserCompletionStatus
} from '@/core/challenges/user-progression'
import { ChallengeIDE } from '@/core/compiler/challenge-editor'
import { getUser } from '@/core/user'
import { AdminComponent } from '@/core/user/components/admin-component'
import { Challenge } from '@/payload-types'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { DraftRedirect } from './components/draft-redirect'
import { ChallengeLayoutHeader } from './components/header'


const getCurrencyOnCompletion = (challenge: Challenge): number => {
  const baseExp = challenge.baseExperience ?? 50
  const min = Math.floor(baseExp * 0.5)
  const max = Math.ceil(baseExp * 1.5)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function LoadingPlaceholder() {
  return <div className="animate-pulse p-6 bg-background/50 rounded-md h-[200px]"></div>
}

export default async function ChallengeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params

  const [challenge, user] = await Promise.all([getChallengeBySlug(challenge_slug), getUser()])

  if (!user) {
    redirect('/auth/login?redirect=' + encodeURIComponent('/challenges/' + challenge_slug))
  }

  const initialCodeVersions =
    challenge.codeVersions?.reduce(
      (acc, version) => {
        acc[version.language] = version.initialCode
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  const initialLanguage = challenge.codeVersions?.[0]?.language || 'javascript'

  const [initialStatus, challengeAIChat] = await Promise.all([
    getUserCompletionStatus(user.id, challenge.id),
    getOrCreateChat({ userId: user.id, challenge: challenge.id }),
  ])

  const messages = await loadChat({ chatId: challengeAIChat.id })
  const currencyOnCompletion = getCurrencyOnCompletion(challenge)

  return (
    <DraftRedirect challenge={challenge} user={user}>
      <ChallengeStoreHydrator challenge={challenge} user={user} currencyOnCompletion={currencyOnCompletion}>
        <ChallengeProvider challenge={challenge}>
          <ChallengeStatusProvider
            challengeId={challenge.id}
            userId={user.id}
            initialStatus={initialStatus}
          >
            <div className="flex h-screen min-h-0">
              <div className="flex flex-col h-full flex-1 min-w-0 min-h-0">
                <ChallengeLayoutHeader
                  challengeSlug={challenge_slug}
                  challengeId={challenge.id}
                  user={user}
                />

                <div className="flex-1 overflow-hidden">
                  <ChallengeEditorProvider
                    initialLanguage={initialLanguage}
                    initialCodePerLanguage={initialCodeVersions}
                  >
                    <ResizablePanelGroup direction="horizontal">
                      <ResizablePanel defaultSize={50} minSize={40}>
                        <div className="flex flex-col h-full">
                          <ChallengeNavigation />
                          <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">
                            <ChallengeViewManager
                              challenge={challenge}
                              user={user}
                              challengeAIChat={challengeAIChat}
                              messages={messages}
                            >
                              <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
                            </ChallengeViewManager>
                          </div>
                        </div>
                      </ResizablePanel>

                      <ResizableHandle withHandle />

                      <ResizablePanel
                        defaultSize={50}
                        minSize={40}
                        className="flex flex-col h-full"
                      >
                        <ChallengeIDE
                          challenge={challenge}
                          userId={user.id}
                          codeVersions={
                            challenge.codeVersions?.map((v) => ({
                              language: v.language,
                              initialCode: v.initialCode,
                              testCases:
                                v.testCases?.map((t) => ({
                                  input: t.input,
                                  expectedOutput: t.expectedOutput,
                                })) || [],
                            })) || []
                          }
                        />
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </ChallengeEditorProvider>
                  <AdminComponent>
                    <ChallengeSettingsBubble challenge={challenge} />
                  </AdminComponent>
                </div>
              </div>
            </div>
            {/* <CompletionDialog userId={user.id} challenge={challenge} /> */}
            <ChallengeTimerStarter challengeId={challenge.id} />
            <NewCompletionDialog userId={user.id} challengeId={challenge.id} />
            {/* <OnboardingDialog /> */}
          </ChallengeStatusProvider>
        </ChallengeProvider>
      </ChallengeStoreHydrator>
    </DraftRedirect>
  )
}
