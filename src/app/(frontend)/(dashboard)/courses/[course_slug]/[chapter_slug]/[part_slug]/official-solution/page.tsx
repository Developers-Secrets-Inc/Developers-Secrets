import { Suspense } from 'react'
import { Markdown } from '@/components/markdown'
import { getPartBySlug } from '@/core/courses/parts'
import { PartHeader } from '../components/part-header'
import { getSessionUser } from '@/core/user'
import { Skeleton } from '@/components/ui/skeleton'
import { CoursePart } from '@/payload-types'
import { notFound } from 'next/navigation'

export const experimental_ppr = true

const DynamicCourseHeader = async ({ part }: { part: CoursePart }) => {
  const userResult = await getSessionUser()
  const userId = userResult.success ? userResult.value.id : null
  return <PartHeader part={part} userId={userId} />
}

const HeaderFallback = () => {
  return <Skeleton className="h-10 w-full mb-4" />
}

export default async function CoursePartOfficialSolutionPage({
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
        <DynamicCourseHeader part={part} />
      </Suspense>
      <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
        {part.officialSolution?.statement ?? 'No official solution available'}
      </Markdown>
    </div>
  )
}
