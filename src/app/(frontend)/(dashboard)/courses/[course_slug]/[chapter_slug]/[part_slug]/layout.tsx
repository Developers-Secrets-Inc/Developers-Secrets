import {
  getChapterOutline,
  getCourseOutline,
  getNextPart,
  getPreviousPart,
} from '@/api/courses/navigation'
import { CoursePartExercice } from '@/api/courses/components/course-part-exercice'
import { CourseLayout } from '@/api/courses/components/layout'
import { CourseFooter } from '@/api/courses/components/layout/footer'
import { getPartBySlug } from '@/api/courses/parts'
import { getUser } from '@/core/users'
import { isNone } from '@/lib/maybe'
import { isFailure } from '@/lib/result'
import { notFound, redirect } from 'next/navigation'
import { CoursePartProvider } from '@/api/courses/contexts/components/course-part-provider'
import { CoursePartViewManager } from '@/api/courses/components/course-part-view-manager'
import { CoursePartNavigationTabs } from '@/api/courses/navigation/components/course-part-navigation-tabs'
import { getOrCreateChat, loadChat } from '@/api/courses/ai-chats'
import { getRemainingMessagesForToday } from '@/core/ai/quotas/actions'
import { getCoursePartCompletionStatus } from '@/api/courses/progression'

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
  children: React.ReactNode
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const [part, user] = await Promise.all([
    getPartBySlug({ part_slug }),
    getUser(),
  ])

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  if (isNone(part)) {
    return notFound()
  }

  const coursePartAIChat = await getOrCreateChat({
    userId: user.value.id,
    coursePart: part.value.id,
  })

  const [messages, quotas] = await Promise.all([
    loadChat({ chatId: coursePartAIChat.id }),
    getRemainingMessagesForToday(user.value.id),
  ])


  return (
    <CoursePartProvider
      coursePart={part.value}
      metadata={{
        courseSlug: course_slug,
        chapterSlug: chapter_slug,
        coursePartAIChat,
        messages,
        quotas,
      }}
    >
      <CourseLayout.Root>
        <CourseLayout.Header courseSlug={course_slug} />
        <CourseLayout.Body>
          <CourseLayout.Content>

            <CourseLayout.LeftPart>
              <CoursePartNavigationTabs />
              <CourseLayout.MainContainer>
                <CoursePartViewManager>{children}</CoursePartViewManager>
              </CourseLayout.MainContainer>
            </CourseLayout.LeftPart>

            <CourseLayout.ContentSeparator />

            <CourseLayout.RightPart>
              <CoursePartExercice exercice={part.value.exercice} />
            </CourseLayout.RightPart>

          </CourseLayout.Content>
        </CourseLayout.Body>

        {/* // ? This component should be fully client, using modern tanstack query server suspense. 
        // ? Too much props here, client components can solve it AND in future version theses components 
        // ? Will need to be on the client for instant revalidation for current course progress. */}
        <CourseFooter
          href={`/courses/${course_slug}/${chapter_slug}`}
          courseSlug={course_slug}
          partSlug={part.value.slug}
          chapterOutline={await getChapterOutline({ chapter_slug, userId: user.value.id })}
        />
      </CourseLayout.Root>
    </CoursePartProvider>
  )
}
