import { AIAssistantDialog } from '@/components/challenges/ai-assistant-dialog'
import { RatingText } from '@/components/rating-dialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { getNextChallenge, getPreviousChallenge } from '@/core/challenges/navigation'
import { ChallengeStatusProvider } from '@/core/challenges/components/challenge-status-provider'
import { ChallengeNavigation } from '@/core/challenges/components/navigation/challenge-navigation'
import { ChallengeReactionButtons } from '@/core/challenges/components/reaction-buttons'
import { ChallengeProvider } from '@/core/challenges/contexts/challenge-context'
import { ChallengeEditorProvider } from '@/core/challenges/contexts/challenge-editor-context'
import {
  getUserCompletionStatus,
  setUserCompletionStatus,
} from '@/core/challenges/user-progression'
import { getUser } from '@/core/user'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ChallengeLayoutHeader } from './components/header'
import { ChallengeStoreHydrator } from '@/core/challenges/components/challenge-store-hydrator'
import { DraftRedirect } from './components/draft-redirect'
import { getChallengeBySlug } from '@/core/challenges/challenge-queries'
import { AdminComponent } from '@/core/user/components/admin-component'
import { ChallengeSettingsBubble } from '@/core/challenges/components/admin/challenge-settings-bubble'
import { ChallengeIDE } from '@/core/compiler/challenge-editor'
import { CompletionDialog } from '@/core/challenges/components/completion-dialog'
import { ClubIcon, DiamondIcon, HeartIcon, LucideIcon, SpadeIcon, Beaker, Bot } from 'lucide-react'
import { ChallengeDescriptionTourAnchor } from '@/core/challenges/components/challenge-description-tour-anchor'
import { ChallengeTourProvider } from '@/core/challenges/components/challenge-tour-context'

function LoadingPlaceholder() {
  return <div className="animate-pulse p-6 bg-background/50 rounded-md h-[200px]"></div>
}

// Define the TourStep interface
interface TourStep {
  iconName: string
  title: string
  description: string
  targetElementId?: string
}

// Define the tourSteps data
const tourSteps: TourStep[] = [
  {
    iconName: 'HeartIcon',
    title: 'Welcome to the Challenge!',
    description:
      "This is your new challenge workspace. Here you'll find the challenge description, instructions, and tests.",
    targetElementId: 'challenge-description-area',
  },
  {
    iconName: 'DiamondIcon',
    title: 'Code Editor',
    description:
      "This is the code editor where you'll write your solution. You can select different languages here.",
    targetElementId: 'challenge-code-editor',
  },
  {
    iconName: 'SpadeIcon',
    title: 'Run Your Code',
    description:
      'Click this button to run your code against custom inputs or see immediate output.',
    targetElementId: 'challenge-run-button',
  },
  {
    iconName: 'ClubIcon',
    title: 'Submit Your Solution',
    description:
      "Once you're confident in your solution, click this button to submit it and complete the challenge!",
    targetElementId: 'challenge-submit-button',
  },
  {
    iconName: 'Beaker',
    title: 'Test Results & Output',
    description:
      'This panel will show you the results of your tests and any output from your code execution.',
    targetElementId: 'challenge-terminal-footer',
  },
  {
    iconName: 'Bot',
    title: 'AI Assistant (Pearl)',
    description:
      "Need a hint? Ask Pearl for help! She's here to guide you without giving away the full solution.",
    targetElementId: 'challenge-ai-assistant-button',
  },
]

export default async function ChallengeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ challenge_slug: string }>
}) {
  const { challenge_slug } = await params

  const challenge = await getChallengeBySlug(challenge_slug)
  const user = await getUser()

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

  const initialStatus = await getUserCompletionStatus(user.id, challenge.id)

  return (
    <DraftRedirect challenge={challenge} user={user}>
      <ChallengeStoreHydrator challenge={challenge} user={user}>
        <ChallengeProvider challenge={challenge}>
          <ChallengeStatusProvider
            challengeId={challenge.id}
            userId={user.id}
            initialStatus={initialStatus}
          >
            <ChallengeTourProvider tourSteps={tourSteps}>
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
                            <ChallengeDescriptionTourAnchor>
                              <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
                            </ChallengeDescriptionTourAnchor>
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
                            htmlId="challenge-code-editor"
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
              <CompletionDialog userId={user.id} challenge={challenge} />
            </ChallengeTourProvider>
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
