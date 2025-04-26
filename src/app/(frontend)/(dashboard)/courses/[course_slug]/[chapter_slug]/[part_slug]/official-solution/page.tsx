import { Markdown } from '@/components/markdown'
import { getPartBySlug } from '@/core/courses/parts'
import { PartHeader } from '../components/part-header'

export default async function CoursePartOfficialSolutionPage({
  params,
}: {
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const part = await getPartBySlug(course_slug, chapter_slug, part_slug)

  return (
    <div className="py-4 px-1">
      <PartHeader part={part} />
      <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
        {part.officialSolution?.statement ?? 'No official solution available'}
      </Markdown>  
    </div>
  )
}
