import { AIAssistantDialog } from '@/components/challenges/ai-assistant-dialog'
import { RatingText } from '@/components/rating-dialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { getNextChallenge, getPreviousChallenge } from '@/core/challenges/navigation'
import { ChallengeStatusProvider } from '@/core/challenges/components/challenge-status-provider'
import { ChallengeNavigation } from '@/core/challenges/components/navigation/challenge-navigation'
import { ChallengeReactionButtons } from '@/core/challenges/components/reaction-buttons'
import { ChallengeProvider } from '@/core/challenges/contexts/challenge-context'
import { ChallengeEditorProvider } from '@/core/challenges/contexts/challenge-editor-context'
import { getUserCompletionStatus, getUserRating } from '@/core/challenges/user-progression'
import { getUser } from '@/core/user'
import { Challenge as PayloadChallenge } from '@/payload-types'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ChallengeEditor } from './components/challenge-editor'
import { ChallengeLayoutHeader } from './components/header'
import { User } from '@/types/user'
import { ChallengeStoreHydrator } from '@/core/challenges/components/challenge-store-hydrator'
import { DraftRedirect } from './components/draft-redirect'
import { getChallengeBySlug } from '@/core/challenges/challenge-queries'
import { AdminComponent } from '@/core/user/components/admin-component'
import { ChallengeSettingsBubble } from '@/core/challenges/components/admin/challenge-settings-bubble'

// Composant de chargement minimaliste pour éviter les flashs UI
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
  // Attendre les paramètres avant de les utiliser
  const { challenge_slug } = await params

  const challenge = await getChallengeBySlug(challenge_slug)

  const user = await getUser()

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!user) {
    redirect('/auth/login?redirect=' + encodeURIComponent('/challenges/' + challenge_slug))
  }

  // Extraire les versions de code disponibles
  const availableLanguages =
    challenge.codeVersions?.map((version) => ({
      value: version.language,
      label: version.language.charAt(0).toUpperCase() + version.language.slice(1),
    })) || []

  const initialCodeVersions =
    challenge.codeVersions?.reduce(
      (acc, version) => {
        acc[version.language] = version.initialCode
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  // Create a map of test cases for each language
  const testCasesByLanguage =
    challenge.codeVersions?.reduce(
      (acc, version) => {
        acc[version.language] =
          version.testCases?.map((test) => ({
            input: test.input,
            expectedOutput: test.expectedOutput,
          })) || []
        return acc
      },
      {} as Record<string, { input: string; expectedOutput: string }[]>,
    ) || {}

  // Get initial language
  const initialLanguage = challenge.codeVersions?.[0]?.language || 'javascript'

  // Get previous and next challenges
  const previousChallenge = await getPreviousChallenge(challenge_slug)
  const nextChallenge = await getNextChallenge(challenge_slug)

  // Get user progression
  const initialStatus = await getUserCompletionStatus(user.id, challenge.id)

  return (
    // ! Should be replace by a store
    <DraftRedirect challenge={challenge} user={user}>
      <ChallengeStoreHydrator challenge={challenge} user={user}>
        <ChallengeProvider challenge={challenge}>
          {/* // ! On devrait utiliser un store Zustand pour gérer le statut de l'utilisateur au lieu d'un provider React */}
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
                  userId={user.id}
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
                            <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
                          </div>
                          <ChallengeFooterContainer>
                            <ChallengeFooterLeftPart>
                              <ChallengeReactionButtons />
                              <RatingText />
                            </ChallengeFooterLeftPart>
                            <AIAssistantDialog />
                          </ChallengeFooterContainer>
                        </div>
                      </ResizablePanel>

                      <ResizableHandle withHandle />

                      <ResizablePanel
                        defaultSize={50}
                        minSize={40}
                        className="flex flex-col h-full"
                      >
                        <ChallengeEditor
                          language={initialLanguage}
                          availableLanguages={availableLanguages}
                          codeVersions={initialCodeVersions}
                          tests={testCasesByLanguage}
                          challenge={challenge}
                          userId={user.id}
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
          </ChallengeStatusProvider>
        </ChallengeProvider>
      </ChallengeStoreHydrator>
    </DraftRedirect>
  )
}

const ChallengeFooterContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50">
      {children}
    </div>
  )
}

const ChallengeFooterLeftPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-between gap-3 mb-3">{children}</div>
}
