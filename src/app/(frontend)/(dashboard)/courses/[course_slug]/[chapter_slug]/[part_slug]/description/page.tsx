import { Markdown } from '@/components/markdown'
import { getPartBySlug } from '@/core/courses/parts'
import { PartHeader } from '../components/part-header'
import { CoursePartHints } from '@/core/courses/components/course-part-hints'
import { getSessionUser } from '@/core/user'

export default async function CoursePartDescriptionPage({
  params,
}: {
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const part = await getPartBySlug(course_slug, chapter_slug, part_slug)
  const userResult = await getSessionUser()
  const userId = userResult.success ? userResult.value.id : null

  return (
    <div className="py-4 px-1">
      <PartHeader part={part} userId={userId} />
      <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
        {part.description.statement}
      </Markdown>

      <CoursePartHints />
    </div>
  )
}
