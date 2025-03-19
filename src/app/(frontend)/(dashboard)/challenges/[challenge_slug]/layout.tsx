import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { CodeEditor } from '@/components/code-editor'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChallengeNavigation } from './components/challenge-navigation'
import { ChallengesNavigationButtons } from './components/challenges-navigation-buttons'
import { Bot, MessageSquareText, ThumbsUp, ThumbsDown } from 'lucide-react'
import { RatingText } from '@/components/rating-dialog'
import { Suspense } from 'react'

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

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b py-3 px-4 bg-background">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Link href="/" prefetch={true}>
              <Eclipse size={23} />
            </Link>
            <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
              <ChallengesNavigationButtons />
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

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-full">
            <ChallengeNavigation challengeSlug={challenge_slug} />
            <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 p-6 min-h-0">
              <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
            </div>
            <div className="p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-green-500 flex items-center gap-1.5"
                    >
                      <ThumbsUp size={16} />
                      <span className="text-sm">Like</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-red-500 flex items-center gap-1.5"
                    >
                      <ThumbsDown size={16} />
                      <span className="text-sm">Dislike</span>
                    </Button>
                  </div>
                  <RatingText />
                </div>
              </div>
              <Button variant="outline" className="w-full flex items-center gap-2 h-10">
                <Bot size={18} />
                <span>Ask AI Assistant</span>
                <MessageSquareText className="ml-auto" size={16} />
              </Button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex flex-col h-full overflow-hidden">
            <CodeEditor initialCode={''} language={'typescript'} showLanguageSelector={true} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
