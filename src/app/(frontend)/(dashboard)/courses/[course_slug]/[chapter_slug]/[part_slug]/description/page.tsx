import { Markdown } from '@/components/markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { getCoursesStaticInformation } from '@/core/courses'
import { CoursePartHints } from '@/core/courses/components/course-part-hints'
import { getPartBySlug } from '@/core/courses/parts'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PartHeader } from '../components/part-header'

export const revalidate = 3600

const HeaderFallback = () => {
  return <Skeleton className="h-10 w-full mb-4" />
}



export default async function CoursePartDescriptionPage({
  params,
}: {
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  const part = await getPartBySlug(course_slug, chapter_slug, part_slug)

  if (!part) {
    notFound()
  }

  return (
    <div className="py-4 px-6">
      <Suspense fallback={<HeaderFallback />}>
        <PartHeader part={part} />
      </Suspense>

      <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
        {part.description.statement}
      </Markdown>

      <CoursePartHints hints={part.description.hints} />
    </div>
  )
}
