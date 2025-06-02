import { Skeleton } from '@/components/ui/skeleton'
import { AIAssistantDialog } from '@/core/courses/components/ai-assistant-dialog'
import { CourseNavigation } from '@/core/courses/components/course-navigation'
import { Suspense } from 'react'
import { getSessionUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { getCoursePartStaticData } from '@/core/courses/parts'
import { getUserPartReaction } from '@/core/courses/engagement/reactions'
import { CoursePartReactions } from '@/core/courses/components/course-part-reactions'
import { CoursePartProvider } from '@/core/courses/contexts/course-part-context'
import Link from 'next/link'

export default async function NewCoursePartContentLayout({
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
  const baseHref = `/courses/${course_slug}/${chapter_slug}/${part_slug}`
  const initialUserReaction = userId
    ? await getUserPartReaction(userId, staticData.currentPart.id)
    : 'none'

  return (
    <div className="flex flex-col h-full">
      <CourseNavigation baseHref={baseHref} userId={userId} partId={staticData.currentPart.id} />
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0 py-4">
        <Suspense>
          {children}
          <Link href={`/new-courses/${course_slug}/${chapter_slug}/${part_slug}/description`}>
            Description
          </Link>
        </Suspense>
      </div>
      <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50 rounded-t-lg border-t border-border/50">
        <div className="flex items-center justify-between gap-3 mb-3">
          <Suspense fallback={<Skeleton className="h-8 w-24" />}>
            <CoursePartReactions
              partId={staticData.currentPart.id}
              userId={userId}
              initialUserReaction={initialUserReaction}
            />{' '}
          </Suspense>
        </div>
        {/* <AIAssistantDialog userId={userId} /> */}
      </div>
    </div>
  )
}
