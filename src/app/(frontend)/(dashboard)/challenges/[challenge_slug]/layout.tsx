import { AIAssistantDialog } from '@/components/challenges/ai-assistant-dialog'
import { OpenChallengeCompletionDialogInDevelopment } from '@/components/challenges/open-challenge-completion-dialog-in-development'
import { RatingText } from '@/components/rating-dialog'
import { IconSidebar } from '@/components/sidebars/home-sidebar/icon-sidebar'
import { NotificationButton } from '@/components/sidebars/home-sidebar/notification-button'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getChallengeBySlug, getNextChallenge, getPreviousChallenge } from '@/core/challenges'
import { ChallengeNavigationButtons } from '@/core/challenges/components/challenge-navigation-buttons'
import { ChallengeStatusProvider } from '@/core/challenges/components/challenge-status-provider'
import { ReactionButtons } from '@/core/challenges/components/reaction-buttons'
import { getUserCompletionStatus, getUserRating } from '@/core/challenges/user-progression'
import { getUser } from '@/core/user'
import { UserDropdownMenu } from '@/core/user/components/user-dropdown-menu'
import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { ChallengeProvider } from '@/core/challenges/contexts/challenge-context'
import { ChallengeEditorProvider } from '@/core/challenges/contexts/challenge-editor-context'
import { ChallengeEditor } from './components/challenge-editor'
import { ChallengeNavigation } from '@/core/challenges/components/navigation/challenge-navigation'
import { User } from '@/types/user'
import { notFound, redirect } from 'next/navigation'
import { Challenge as PayloadChallenge } from '@/payload-types'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
// Composant de chargement minimaliste pour éviter les flashs UI
function LoadingPlaceholder() {
  return <div className="animate-pulse p-6 bg-background/50 rounded-md h-[200px]"></div>
}

const ChallengeLayoutHeader = ({
  challengeSlug,
  user,
  challengeId,
}: {
  challengeSlug: string
  user: User
  challengeId: number
}) => {
  return (
    <header className="flex-none py-3 px-4 bg-background">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {/* <Link href="/" prefetch={true}>
            <Eclipse size={23} />
          </Link> */}
          <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
            <ChallengeNavigationButtons currentChallengeSlug={challengeSlug} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <OpenChallengeCompletionDialogInDevelopment
            challengeId={challengeId}
            userId={user.id}
            challengeSlug={challengeSlug}
          />
          <NotificationButton />

          <Button variant="outline" size="sm" asChild>
            <Link href="/home">Dashboard</Link>
          </Button>
          <UserDropdownMenu user={user} />
        </div>
      </div>
    </header>
  )
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

  // Get challenge info
  let challenge: PayloadChallenge
  try {
    challenge = await getChallengeBySlug(challenge_slug)
  } catch (error) {
    notFound()
  }
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
  const userRating = await getUserRating(user.id, challenge.id)


  return (
    <SidebarProvider open={false}>
      <ChallengeProvider challenge={challenge}>
        <ChallengeStatusProvider
          challengeId={challenge.id}
          userId={user.id}
          initialStatus={initialStatus}
        >
          <div className="flex h-screen min-h-0">
            <HomeSidebar defaultOpen={false} />
            <SidebarInset>
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
                          <ChallengeNavigation
                            challenge={{
                              id: challenge.id,
                              slug: challenge_slug,
                            }}
                            userId={user.id}
                          />
                          <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">
                            <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
                          </div>
                          <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50">
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <ReactionButtons challengeId={challenge.id} userId={user.id} />
                              <RatingText
                                challengeId={challenge.id}
                                initialRating={userRating ?? undefined}
                              />
                            </div>
                            <AIAssistantDialog challengeSlug={challenge.slug} />
                          </div>
                        </div>
                      </ResizablePanel>
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={50} minSize={40}>
                        <div className="flex flex-col h-full">
                          <ChallengeEditor
                            language={initialLanguage}
                            availableLanguages={availableLanguages}
                            codeVersions={initialCodeVersions}
                            tests={testCasesByLanguage}
                            challenge={challenge}
                            userId={user.id}
                          />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </ChallengeEditorProvider>
                </div>
              </div>
            </SidebarInset>
          </div>
        </ChallengeStatusProvider>
      </ChallengeProvider>
    </SidebarProvider>
  )
}
