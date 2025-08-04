'use client'

import { use } from 'react'
import { PartProgressionDot } from '../../progression/components/part-progression-dot'
import { useCourseParams } from '../hooks/use-course-params'
import { useChapterPartsProgression } from '../../progression/hooks/useChapterPartsProgression'
import { Skeleton } from '@/components/ui/skeleton'

export const ChapterOutline = ({
  outline,
}: {
  outline: {
    id: number
    name: string
    slug: string
    // isCurrent: boolean
    completionStatus: 'not_started' | 'in_progress' | 'completed'
  }[]
}) => {
  const { courseSlug, chapterSlug, partSlug } = useCourseParams()
  const { parts, isLoading, error } = useChapterPartsProgression(chapterSlug, courseSlug, { initialData: outline })


  if (!parts) {
    return null
  }

  if (isLoading) {
    return <Skeleton className="h-5 w-[100px]" />
  }

  return (
    <div className="flex-none flex justify-center items-center gap-2 mx-4">
      {parts.map((part) => (
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
