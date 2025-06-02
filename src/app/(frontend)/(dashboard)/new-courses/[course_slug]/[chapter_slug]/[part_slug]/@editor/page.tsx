import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseCodeEditor } from '@/core/courses/components/course-code-editor'
import { getSessionUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { getCoursePartStaticData } from '@/core/courses/parts'
import { getUserPartCompletionStatus } from '@/core/courses/progression/completion-status'
import { EditorStateProvider } from '@/core/courses/contexts/editor-state-context'

export default async function NewCoursePartEditor({
  params,
}: {
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const staticData = await getCoursePartStaticData(course_slug, chapter_slug, part_slug)
  const userResult = await getSessionUser()

  if (!userResult.success) {
    redirect('/auth/login')
  }

  const userId = userResult.value.id

  const initialLanguage =
    staticData.currentPart?.challenges?.[0]?.languages?.[0]?.name?.toLowerCase() ?? 'javascript'

  const initialCompletionStatus = await getUserPartCompletionStatus(
    userId,
    staticData.currentPart.id,
  )
  return (
    <EditorStateProvider initialLanguage={initialLanguage}>
      <div className="flex flex-col h-full bg-muted/40">
        <Suspense
          fallback={
            <div className="p-4">
              <Skeleton className="h-full w-full" />
            </div>
          }
        >
          <CourseCodeEditor
            coursePart={staticData.currentPart}
            userId={userId}
            initialCompletionStatus={initialCompletionStatus}
          />
        </Suspense>
      </div>
    </EditorStateProvider>
  )
}
