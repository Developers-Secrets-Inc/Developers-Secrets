import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { CodeEditor } from '@/components/code-editor'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChallengeNavigation } from './components/challenge-navigation'
import { ChallengesNavigationButtons } from './components/challenges-navigation-buttons'
import { Bot, MessageSquareText } from 'lucide-react'
import { RatingText } from '@/components/rating-dialog'
import { Suspense } from 'react'
import { ReactionButtons } from '@/components/challenges/reaction-buttons'
import { AIAssistantDialog } from '@/components/challenges/ai-assistant-dialog'
import { getChallengeBySlug, getPreviousChallenge, getNextChallenge } from '@/core/challenges'
import { getUserChallengeProgression } from '@/core/user-progression'
import { getUser } from '@/core/user'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { IconSidebar } from '@/components/sidebars/home-sidebar/icon-sidebar'

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

  // Get challenge info
  const challenge = await getChallengeBySlug(challenge_slug)

  // Get previous and next challenges
  const previousChallenge = await getPreviousChallenge(challenge_slug)
  const nextChallenge = await getNextChallenge(challenge_slug)

  // Get user info
  let userId = ''
  let hasLiked = false
  let hasDisliked = false
  let userRating: number | undefined = undefined

  try {
    const user = await getUser()
    userId = user.id

    // Fetch user progression if we have a user ID
    if (userId) {
      try {
        const userProgress = await getUserChallengeProgression(userId, challenge_slug)
        if (userProgress) {
          hasLiked = !!userProgress.hasLiked
          hasDisliked = !!userProgress.hasDisliked
          userRating = userProgress.rating ?? undefined
        }
      } catch (progressError) {
        console.error('Error fetching user progression:', progressError)
        // Continue with default values
      }
    }
  } catch (userError) {
    console.error('Error fetching user:', userError)
    // Continue as guest user
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <IconSidebar />
        <SidebarInset>
          <div className="flex flex-col h-full w-[calc(100vw-3.5rem)]">
            <header className="flex-none border-b py-3 px-4 bg-background">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <Link href="/" prefetch={true}>
                    <Eclipse size={23} />
                  </Link>
                  <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
                    <ChallengesNavigationButtons
                      challengeSlug={challenge_slug}
                      previousChallengeSlug={previousChallenge.slug}
                      nextChallengeSlug={nextChallenge.slug}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    asChild
                    variant="outline"
                    className="h-9 px-3 py-1.5 text-sm"
                    aria-label="Back to dashboard"
                  >
                    <Link href="/dashboard" prefetch={true}>
                      Dashboard
                    </Link>
                  </Button>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-hidden">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="flex flex-col h-full">
                    <ChallengeNavigation challengeSlug={challenge_slug} />
                    <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">
                      <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
                    </div>
                    <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 flex items-center justify-between">
                          <ReactionButtons
                            initialLiked={hasLiked}
                            initialDisliked={hasDisliked}
                            challengeSlug={challenge_slug}
                          />
                          <RatingText challengeSlug={challenge_slug} initialRating={userRating} />
                        </div>
                      </div>
                      <AIAssistantDialog challengeSlug={challenge_slug} />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="flex flex-col h-full">
                    <CodeEditor
                      initialCode={''}
                      language={'typescript'}
                      showLanguageSelector={true}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
