import { SidebarProvider } from '@/components/ui/sidebar'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import { CoursePartMainHeader } from './[part_slug]/components/course-part-main-header'
import {
  getCourseStaticOutline,
  getUserSpecificCourseOutlineWithStatus,
} from '@/core/courses/parts'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/core/user'

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

export default async function CourseChapterLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ course_slug: string; chapter_slug: string }>
}) {
  const { course_slug, chapter_slug } = await params
  const courseOutline = await getCourseOutline(course_slug, chapter_slug)

  return children
}

// TODO: Add a real course locked check.
