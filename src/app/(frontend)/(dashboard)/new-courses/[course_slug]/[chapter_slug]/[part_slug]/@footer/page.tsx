import { redirect } from 'next/navigation'
import { getSessionUser } from '@/core/user'
import { PartFooter } from '@/app/(frontend)/(dashboard)/courses/[course_slug]/[chapter_slug]/[part_slug]/components/part-footer';
import {
  getCoursePartStaticData,
  getUserSpecificFooterData,
  getNextButtonLockState,
} from '@/core/courses/parts'

export default async function NewCoursePartFooter({
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
