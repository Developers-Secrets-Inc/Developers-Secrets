import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Skeleton } from '@/components/ui/skeleton'
import { AIAssistantDialog } from '@/core/courses/components/ai-assistant-dialog'
import { CourseCodeEditor } from '@/core/courses/components/course-code-editor'
import { CourseNavigation } from '@/core/courses/components/course-navigation'
import { CoursePartReactions } from '@/core/courses/components/course-part-reactions'
import { SettingsBubble } from '@/core/courses/components/settings/settings-bubble'
import { TrackLastVisitedPart } from '@/core/courses/components/track-last-visited-part'
import { CoursePartProvider } from '@/core/courses/contexts/course-part-context'
import { EditorStateProvider } from '@/core/courses/contexts/editor-state-context'
import { getUserPartReaction } from '@/core/courses/engagement/reactions'
import {
  CoursePartStaticData,
  getCoursePartStaticData,
  getNextButtonLockState,
  getUserSpecificCourseOutline as getUserSpecificCourseOutline,
  getUserSpecificFooterData,
  getUserSpecificCourseOutlineWithStatus,
} from '@/core/courses/parts'
import { getUserPartCompletionStatus } from '@/core/courses/progression/completion-status'
import { getSessionUser } from '@/core/user'
import { CoursePart } from '@/payload-types'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { CoursePartMainHeader } from './components/course-part-main-header'
import { PartFooter } from './components/part-footer'
import { AdminComponent } from '@/core/user/components/admin-component'
import type { CourseOutlineUserData, ChapterPartStatusInfo } from '@/core/courses/parts'

const DynamicHeaderWrapper = async ({
  userId,
  staticData,
}: {
  userId: string | null
  staticData: CoursePartStaticData
}) => {
  const courseOutlineUserWithStatus = await getUserSpecificCourseOutlineWithStatus(
    userId,
    staticData.courseOutlineStatic,
  )
  const currentChapterOutline = courseOutlineUserWithStatus.find(
    (c) => c.chapterSlug === staticData.currentChapter.slug,
  )
  if (currentChapterOutline?.isLocked) {
    console.log(
      `User ${userId} redirected from layout. Chapter ${staticData.currentChapter.slug} is locked.`,
    )
    redirect(`/courses/${staticData.course.slug}`)
  }
  return (
    <CoursePartMainHeader
      courseOutlineData={courseOutlineUserWithStatus}
      courseSlug={staticData.course.slug}
    />
  )
}

const DynamicReactionsWrapper = async ({
  userId,
  partId,
}: {
  userId: string | null
  partId: number
}) => {
  const initialUserReaction = userId ? await getUserPartReaction(userId, partId) : 'none'
  return (
    <CoursePartReactions
      partId={partId}
      userId={userId}
      initialUserReaction={initialUserReaction}
    />
  )
}

const DynamicEditorWrapper = async ({
  userId,
  part,
}: {
  userId: string | null
  part: CoursePart
}) => {
  const initialCompletionStatus = userId
    ? await getUserPartCompletionStatus(userId, part.id)
    : 'not_started'
  return (
    <CourseCodeEditor
      coursePart={part}
      userId={userId}
      initialCompletionStatus={initialCompletionStatus}
    />
  )
}

const DynamicFooterWrapper = async ({
  userId,
  staticData,
}: {
  userId: string | null
  staticData: CoursePartStaticData
}) => {
  const footerPartsUser = await getUserSpecificFooterData(
    userId,
    staticData.chapterPartsForFooterStatic,
  )
  const nextUrl =
    staticData.navigationParts.next.chapterSlug && staticData.navigationParts.next.partSlug
      ? `/courses/${staticData.course.slug}/${staticData.navigationParts.next.chapterSlug}/${staticData.navigationParts.next.partSlug}/description`
      : null
  const prevUrl =
    staticData.navigationParts.prev.chapterSlug && staticData.navigationParts.prev.partSlug
      ? `/courses/${staticData.course.slug}/${staticData.navigationParts.prev.chapterSlug}/${staticData.navigationParts.prev.partSlug}/description`
      : null
  const lockNextButton = await getNextButtonLockState(
    userId,
    staticData.currentChapter.id,
    staticData.currentChapter.slug,
    nextUrl,
  )

  return (
    <PartFooter
      prevPartUrl={prevUrl}
      nextPartUrl={nextUrl}
      chapterParts={footerPartsUser}
      currentPartSlug={staticData.currentPart.slug}
      courseSlug={staticData.course.slug}
      chapterSlug={staticData.currentChapter.slug}
      userId={userId}
      currentChapterId={staticData.currentChapter.id}
      initialLockNextButton={lockNextButton}
    />
  )
}

const DynamicSettingsBubbleWrapper = async ({
  userId,
  partId,
}: {
  userId: string | null
  partId: number
}) => {
  const initialCompletionStatus = userId
    ? await getUserPartCompletionStatus(userId, partId)
    : 'not_started'
  return (
    <AdminComponent>
      <SettingsBubble partId={partId} initialCompletionStatus={initialCompletionStatus} />
    </AdminComponent>
  )
}

export default async function CoursePartLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const staticData = await getCoursePartStaticData(course_slug, chapter_slug, part_slug)
  const userResult = await getSessionUser()
  const userId = userResult.success ? userResult.value.id : null

  const baseHref = `/courses/${staticData.course.slug}/${staticData.currentChapter.slug}/${staticData.currentPart.slug}`

  const initialLanguage =
    staticData.currentPart?.challenges?.[0]?.languages?.[0]?.name?.toLowerCase() ?? 'javascript'

  return (
    <CoursePartProvider part={staticData.currentPart}>
      <div className="flex h-screen">
        <TrackLastVisitedPart />
        <div className="flex flex-col h-full w-screen">
          <DynamicHeaderWrapper userId={userId} staticData={staticData} />

          <div className="flex-1 overflow-hidden">
            <EditorStateProvider initialLanguage={initialLanguage}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={40}>
                  <div className="flex flex-col h-full">
                    <CourseNavigation
                      baseHref={baseHref}
                      userId={userId}
                      partId={staticData.currentPart.id}
                    />
                    <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0 py-4">
                      <Suspense>{children}</Suspense>
                    </div>
                    <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50 rounded-t-lg border-t border-border/50">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <Suspense fallback={<Skeleton className="h-8 w-24" />}>
                          <DynamicReactionsWrapper
                            userId={userId}
                            partId={staticData.currentPart.id}
                          />
                        </Suspense>
                      </div>
                      <AIAssistantDialog userId={userId} />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={40}>
                  <div className="flex flex-col h-full bg-muted/40">
                    <Suspense
                      fallback={
                        <div className="p-4">
                          <Skeleton className="h-full w-full" />
                        </div>
                      }
                    >
                      <DynamicEditorWrapper userId={userId} part={staticData.currentPart} />
                    </Suspense>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </EditorStateProvider>
          </div>

          <DynamicFooterWrapper userId={userId} staticData={staticData} />

          <Suspense fallback={null}>
            <DynamicSettingsBubbleWrapper userId={userId} partId={staticData.currentPart.id} />
          </Suspense>
        </div>
      </div>
    </CoursePartProvider>
  )
}
