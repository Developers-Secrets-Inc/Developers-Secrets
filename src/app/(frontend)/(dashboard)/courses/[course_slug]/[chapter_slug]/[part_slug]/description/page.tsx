import { getPartBySlug } from '@/api/courses/parts'
import { PartHeader } from '@/app/(frontend)/(dashboard)/courses/[course_slug]/[chapter_slug]/[part_slug]/components/part-header'
import { Markdown } from '@/components/markdown'
import { getUser } from '@/core/users'
import { isNone } from '@/lib/maybe'
import { isFailure } from '@/lib/result'
import { notFound, redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params
  const [part, user] = await Promise.all([getPartBySlug({ part_slug }), getUser()])

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  if (isNone(part)) {
    return notFound()
  }

  return (
    <div className="p-6">
      <PartHeader part={part.value} />

      <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
        {part.value.description.statement}
      </Markdown>
    </div>
  )
}
