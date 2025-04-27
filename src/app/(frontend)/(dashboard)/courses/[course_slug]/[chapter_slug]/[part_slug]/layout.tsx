import { CoursePartMainHeader } from './components/course-part-main-header'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { AIAssistantDialog } from '@/core/courses/components/ai-assistant-dialog'
import { CourseNavigation } from '@/core/courses/components/course-navigation'
import { CoursePartReactions } from '@/core/courses/components/course-part-reactions'
import { RatingText } from '@/core/courses/components/rating-text'
import { getPartBySlug, getNavigationParts, getPartById } from '@/core/courses/parts'
import { getChapterBySlug, getChapterById } from '@/core/courses/chapters'
import { getCourseBySlug } from '@/core/courses'
import {
  getAllUserPartCompletionStatusesForChapter,
  getUserPartCompletionStatus,
  getUserChapterCompletionStatus,
} from '@/core/courses/progression/completion-status'
import { checkChapterPrerequisites } from '@/core/courses/progression/actions'
import { Suspense } from 'react'
import { PartFooter } from './components/part-footer'
import { SettingsBubble } from '@/core/courses/components/settings/settings-bubble'
import { getSessionUser } from '@/core/user'
import { CompletionStatus } from '@/core/courses/hooks/use-course-part-completion-status'
import { CoursePartProvider } from '@/core/courses/contexts/course-part-context'
import { CourseCodeEditor } from '@/core/courses/components/course-code-editor'
import { CoursePart, Chapter } from '@/payload-types'
import { redirect } from 'next/navigation'
import { TrackLastVisitedPart } from '@/core/courses/components/track-last-visited-part'
import { EditorStateProvider } from '@/core/courses/contexts/editor-state-context'

export type ChapterPartStatusInfo = {
  id: number
  name: string
  slug: string
  status: CompletionStatus
}

export type CourseOutlineData = {
  chapterSlug: string
  chapterName: string
  parts: { name: string; slug: string }[]
  isLocked: boolean
}[]

export default async function CoursePartLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const course = await getCourseBySlug(course_slug)
  const userResult = await getSessionUser()
  const userId = userResult.success ? userResult.value.id : null

  let currentChapter: Chapter
  try {
    currentChapter = await getChapterBySlug(course_slug, chapter_slug)
  } catch (error) {
    console.error('Error fetching current chapter:', error)
    return redirect('/courses')
  }

  const arePrerequisitesMet = await checkChapterPrerequisites(userId, currentChapter.id)
  if (!arePrerequisitesMet) {
    console.log(`User ${userId} redirected from chapter ${chapter_slug}. Prerequisites not met.`)
    return redirect('/courses')
  }

  const courseOutline: CourseOutlineData = await Promise.all(
    (course.orderedChapters || []).map(async (chapRef) => {
      const chapter =
        typeof chapRef === 'number' ? await getChapterById(chapRef) : (chapRef as Chapter)

      if (!chapter) return null

      const isLocked = !(await checkChapterPrerequisites(userId, chapter.id))

      const resolvedParts = await Promise.all(
        (chapter.parts || []).map(async (partRef) => {
          const part =
            typeof partRef === 'number' ? await getPartById(partRef) : (partRef as CoursePart)
          return part ? { name: part.name, slug: part.slug } : null
        }),
      ).then((parts) => parts.filter((p): p is { name: string; slug: string } => p !== null))

      return {
        chapterSlug: chapter.slug,
        chapterName: chapter.name,
        parts: resolvedParts,
        isLocked: isLocked,
      }
    }),
  ).then((chapters) => chapters.filter((c): c is Exclude<typeof c, null> => c !== null))

  const currentPart = await getPartBySlug(course_slug, chapter_slug, part_slug)

  const initialCompletionStatus = userId
    ? await getUserPartCompletionStatus(userId, currentPart.id)
    : 'not_started'

  const resolvedChapterPartsForFooter: CoursePart[] = await Promise.all(
    (currentChapter.parts || []).map(async (partRef) => {
      if (typeof partRef === 'number') {
        try {
          return await getPartById(partRef)
        } catch {
          return null
        }
      }
      return partRef as CoursePart
    }),
  ).then((parts) => parts.filter((p): p is CoursePart => p !== null))
  const partIdsForFooter = resolvedChapterPartsForFooter.map((p) => p.id)
  let partStatusesForFooter: Record<number, CompletionStatus> = {}
  if (userId) {
    partStatusesForFooter = await getAllUserPartCompletionStatusesForChapter(
      userId,
      partIdsForFooter,
    )
  }
  const chapterPartsWithStatusForFooter: ChapterPartStatusInfo[] =
    resolvedChapterPartsForFooter.map((part) => ({
      id: part.id,
      name: part.name,
      slug: part.slug,
      status: partStatusesForFooter[part.id] || 'not_started',
    }))

  const { prev, next } = await getNavigationParts(course_slug, chapter_slug, part_slug)

  const buildUrl = (navInfo: { chapterSlug: string | null; partSlug: string | null }) => {
    if (navInfo.chapterSlug && navInfo.partSlug) {
      return `/courses/${course_slug}/${navInfo.chapterSlug}/${navInfo.partSlug}`
    }
    return null
  }

  const prevPartUrl = buildUrl(prev)
  const nextPartUrl = buildUrl(next)

  let initialLockNextButton = false
  if (userId && nextPartUrl) {
    const urlParts = nextPartUrl.split('/')
    if (urlParts.length === 5) {
      const nextChapterSlugFromUrl = urlParts[3]
      if (nextChapterSlugFromUrl !== chapter_slug) {
        const currentChapterStatus = await getUserChapterCompletionStatus(userId, currentChapter.id)
        if (currentChapterStatus !== 'completed') {
          initialLockNextButton = true
        }
      }
    }
  }

  const baseHref = `/courses/${course_slug}/${chapter_slug}/${part_slug}`

  return (
    <CoursePartProvider part={currentPart}>
      <div className="flex h-screen">
        <TrackLastVisitedPart />
        <div className="flex flex-col h-full w-screen">
          <CoursePartMainHeader courseOutlineData={courseOutline} courseSlug={course_slug} />

          <div className="flex-1 overflow-hidden">
            <EditorStateProvider
              initialLanguage={/* TODO: Get actual initial language? */ 'javascript'}
            >
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={40}>
                  <div className="flex flex-col h-full">
                    <CourseNavigation baseHref={baseHref} userId={userId} partId={currentPart.id} />
                    <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0 p-4">
                      <Suspense>{children}</Suspense>
                    </div>
                    <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50 rounded-t-lg border-t border-border/50">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <CoursePartReactions partId={currentPart.id} />
                        <RatingText />
                      </div>
                      <AIAssistantDialog userId={userId} />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={40}>
                  <div className="flex flex-col h-full bg-muted/40">
                    <CourseCodeEditor
                      coursePart={currentPart}
                      userId={userId}
                      initialCompletionStatus={initialCompletionStatus}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </EditorStateProvider>
          </div>

          <PartFooter
            prevPartUrl={prevPartUrl}
            nextPartUrl={nextPartUrl}
            chapterParts={chapterPartsWithStatusForFooter}
            currentPartSlug={part_slug}
            courseSlug={course_slug}
            chapterSlug={chapter_slug}
            userId={userId}
            currentChapterId={currentChapter.id}
            initialLockNextButton={initialLockNextButton}
          />

          <SettingsBubble
            partId={currentPart.id}
            initialCompletionStatus={initialCompletionStatus}
          />
        </div>
      </div>
    </CoursePartProvider>
  )
}
