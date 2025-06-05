import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { AIAssistantDialog } from '@/core/courses/components/ai-assistant-dialog'
import { CourseCodeEditor } from '@/core/courses/components/course-code-editor'
import { CourseNavigation } from '@/core/courses/components/course-navigation'
import {
  PartReactions,
  PartReactionsSkeleton,
} from '@/core/courses/components/course-part-reactions'
import { SettingsBubble } from '@/core/courses/components/settings/settings-bubble'
import { TrackLastVisitedPart } from '@/core/courses/components/track-last-visited-part'
import { CoursePartProvider } from '@/core/courses/contexts/course-part-context'
import { EditorStateProvider } from '@/core/courses/contexts/editor-state-context'
import {
  CoursePartStaticData,
  getCoursePartStaticData,
  getCourseStaticOutline,
  getNextButtonLockState,
  getUserSpecificCourseOutlineWithStatus,
  getUserSpecificFooterData,
} from '@/core/courses/parts'
import { getUserPartCompletionStatus } from '@/core/courses/progression/completion-status'
import { getSessionUser } from '@/core/user'
import { AdminComponent } from '@/core/user/components/admin-component'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { PartFooter } from './components/part-footer'
import { CoursePartMainHeader } from './components/course-part-main-header'

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

const getCourseOutline = async (courseSlug: string, chapterSlug: string) => {
  const user = await getSessionUser()
  if (!user.success) {
    redirect('/login')
  }

  const userId = user.value?.id

  const courseOutlineStatic = await getCourseStaticOutline(courseSlug)

  const courseOutlineUserWithStatus = await getUserSpecificCourseOutlineWithStatus(
    userId,
    courseOutlineStatic,
  )
  const currentChapterOutline = courseOutlineUserWithStatus.find(
    (c) => c.chapterSlug === chapterSlug,
  )
  if (currentChapterOutline?.isLocked) {
    redirect(`/courses/${courseSlug}`)
  }
  return courseOutlineUserWithStatus
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

  if (!userResult.success) {
    redirect('/auth/login')
  }

  const userId = userResult.value.id

  const baseHref = `/courses/${staticData.course.slug}/${staticData.currentChapter.slug}/${staticData.currentPart.slug}`

  const initialLanguage =
    staticData.currentPart?.challenges?.[0]?.languages?.[0]?.name?.toLowerCase() ?? 'javascript'

  const initialCompletionStatus = await getUserPartCompletionStatus(userId, staticData.currentPart.id)
  const courseOutline = await getCourseOutline(course_slug, chapter_slug)


  return (
    <CoursePartProvider part={staticData.currentPart}>
      <div className="flex h-screen">
        <TrackLastVisitedPart />
        <div className="flex flex-col h-full w-screen">
          <CoursePartMainHeader courseOutlineData={courseOutline} courseSlug={course_slug} />

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
                        <PartReactions partId={staticData.currentPart.id} userId={userId} />
                      </div>
                      <AIAssistantDialog userId={userId} />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={40}>
                  <div className="flex flex-col h-full bg-muted/40">
                      <CourseCodeEditor
                        coursePart={staticData.currentPart}
                        userId={userId}
                        initialCompletionStatus={initialCompletionStatus}
                      />
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

const PartContent = async ({
  children,
  baseHref,
  userId,
  staticData,
}: {
  children: React.ReactNode
  baseHref: string
  userId: string
  staticData: CoursePartStaticData
}) => {
  return (
    <div className="flex flex-col h-full">
      <CourseNavigation baseHref={baseHref} userId={userId} partId={staticData.currentPart.id} />
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0 py-4">
        <Suspense>{children}</Suspense>
      </div>
      <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50 rounded-t-lg border-t border-border/50">
        <div className="flex items-center justify-between gap-3 mb-3">
          <Suspense fallback={<PartReactionsSkeleton />}>
            <PartReactions partId={staticData.currentPart.id} userId={userId} />
          </Suspense>
        </div>
        <AIAssistantDialog userId={userId} />
      </div>
    </div>
  )
}

const Part = {
  content: PartContent,
}
