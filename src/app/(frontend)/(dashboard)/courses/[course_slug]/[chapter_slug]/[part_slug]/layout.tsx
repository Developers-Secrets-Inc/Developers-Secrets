import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { AIAssistantDialog } from '@/core/courses/components/ai-assistant-dialog'
import { CourseNavigation } from '@/core/courses/components/course-navigation'
import { CoursePartReactions } from '@/core/courses/components/course-part-reactions'
import { RatingText } from '@/core/courses/components/rating-text'
import { getPartBySlug } from '@/core/courses/parts'
import { Suspense } from 'react'
import { PartFooter } from './components/part-footer'
import { SettingsBubble } from '@/core/courses/components/settings/settings-bubble'
import { getSessionUser } from '@/core/user'
import { getUserPartCompletionStatus } from '@/core/courses/progression/completion-status'
import { CoursePartProvider } from '@/core/courses/contexts/course-part-context'
import { CourseCodeEditor } from '@/core/courses/components/course-code-editor'

export default async function CoursePartLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const part = await getPartBySlug(course_slug, chapter_slug, part_slug)

  // Récupérer userId et initialStatus côté serveur
  const userResult = await getSessionUser()
  const userId = userResult.success ? userResult.value.id : null
  const initialCompletionStatus = userId
    ? await getUserPartCompletionStatus(userId, part.id)
    : 'not_started' // Statut par défaut si non connecté ou erreur

  const prevPartUrl = null // Placeholder
  const nextPartUrl = null // Placeholder

  const baseHref = `/courses/${course_slug}/${chapter_slug}/${part_slug}`

  return (
    <CoursePartProvider part={part}>
      <div className="flex h-screen">
        <div className="flex flex-col h-full w-screen">
          <HomeHeader />

          <div className="flex-1 overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={40}>
                <div className="flex flex-col h-full">
                  <CourseNavigation baseHref={baseHref} />
                  <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0 p-4">
                    <Suspense>{children}</Suspense>
                  </div>
                  <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <CoursePartReactions partId={part.id} />
                      <RatingText />
                    </div>
                    <AIAssistantDialog />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={40}>
                <div className="flex flex-col h-full bg-muted/40">
                  <CourseCodeEditor coursePart={part} userId={userId} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          <PartFooter prevPartUrl={prevPartUrl} nextPartUrl={nextPartUrl} />

          <SettingsBubble partId={part.id} initialCompletionStatus={initialCompletionStatus} />
        </div>
      </div>
    </CoursePartProvider>
  )
}
