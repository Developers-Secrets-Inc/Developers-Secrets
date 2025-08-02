'use client'

import { use } from 'react'
import { PartProgressionDot } from '../../progression/components/part-progression-dot'
import { useCourseParams } from '../hooks/use-course-params'

export const ChapterOutline = ({
  outline,
}: {
  outline: Promise<{
    id: number
    name: string
    slug: string
    // isCurrent: boolean
    completionStatus: 'not_started' | 'in_progress' | 'completed'
  }[]>
}) => {
  const { courseSlug, chapterSlug, partSlug } = useCourseParams()
  const courseOutline = use(outline)

  return (
    <div className="flex-none flex justify-center items-center gap-2 mx-4">
      {courseOutline.map((part) => (
        <PartProgressionDot 
          key={part.id} 
          part={part} 
          currentPartSlug={partSlug}
          courseSlug={courseSlug}
          chapterSlug={chapterSlug}
        />
      ))}
    </div>
  )
}
