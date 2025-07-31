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
import { UpdateLastVisited } from './update-last-visited'

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
  children: React.ReactNode
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const [part, user, courseOutline, previousPart, nextPart] = await Promise.all([
    getPartBySlug({ part_slug }),
    getUser(),
    getCourseOutline({ course_slug }),
    getPreviousPart({ course_slug, part_slug }),
    getNextPart({ course_slug, part_slug }),
  ])

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  if (isNone(part)) {
    return notFound()
  }

      <UpdateLastVisited
        courseSlug={course_slug}
        chapterSlug={chapter_slug}
        partSlug={part_slug}
        userId={user.value.id}
      />
  

  const coursePartAIChat = await getOrCreateChat({
    userId: user.value.id,
    coursePart: part.value.id,
  })

  const [messages, quotas] = await Promise.all([
    loadChat({ chatId: coursePartAIChat.id }),
    getRemainingMessagesForToday(user.value.id),
  ])

  const chapterOutline = await getChapterOutline({ chapter_slug, userId: user.value.id })

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
        <CourseLayout.Header courseOutline={courseOutline} />
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
        <CourseFooter
          courseSlug={`/courses/${course_slug}/${chapter_slug}`}
          previousPart={previousPart}
          nextPart={nextPart}
          chapterOutline={chapterOutline}
        />
      </CourseLayout.Root>
    </CoursePartProvider>
  )
}
