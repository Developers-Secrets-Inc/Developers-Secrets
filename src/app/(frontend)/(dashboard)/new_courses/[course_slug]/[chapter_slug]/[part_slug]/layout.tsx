import { getCourseOutline } from '@/api/courses/navigation'
import { CoursePartExercice } from '@/api/courses/components/course-part-exercice'
import { CourseLayout } from '@/api/courses/components/layout'
import { CourseFooter } from '@/api/courses/components/layout/footer'
import { getPartBySlug } from '@/api/courses/parts'
import { getUser } from '@/core/users'
import { isNone } from '@/lib/maybe'
import { isFailure } from '@/lib/result'
import { notFound, redirect } from 'next/navigation'

export default async function Layout({
  params,
}: {
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const [part, user, courseOutline] = await Promise.all([
    getPartBySlug({ part_slug }),
    getUser(),
    getCourseOutline({ course_slug }),
  ])

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  if (isNone(part)) {
    return notFound()
  }

  return (
    <CourseLayout.Root>
      <CourseLayout.Header courseOutline={courseOutline} />
      <CourseLayout.Body>
        <CourseLayout.Content>
          <CourseLayout.LeftPart>
            <CourseLayout.MainContainer>{''}</CourseLayout.MainContainer>
          </CourseLayout.LeftPart>
          <CourseLayout.ContentSeparator />
          <CourseLayout.RightPart>
            <CoursePartExercice />
          </CourseLayout.RightPart>
        </CourseLayout.Content>
      </CourseLayout.Body>
      <CourseFooter />
    </CourseLayout.Root>
  )
}
