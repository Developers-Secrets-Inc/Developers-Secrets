'use client'

import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { ChapterPartStatusInfo } from '@/core/courses/parts'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import Link from 'next/link'
import { useUserChapterPartsProgress } from '@/core/courses/hooks/use-user-chapter-parts-progress'

const getPartStyle = (part: ChapterPartStatusInfo, currentPartSlug: string) => {
  const isCurrent = part.slug === currentPartSlug
  let styles = 'w-2.5 h-2.5 rounded-full border transition-colors cursor-pointer'

  if (isCurrent) {
    styles = cn(styles, 'bg-primary border-primary ring-2 ring-primary/30 scale-110')
  } else {
    switch (part.status) {
      case 'completed':
        styles = cn(styles, 'bg-green-500 border-green-600 hover:bg-green-600')
        break
      case 'in_progress':
        styles = cn(styles, 'bg-amber-500 border-amber-600 hover:bg-amber-600')
        break
      case 'not_started':
      default:
        styles = cn(styles, 'bg-muted border-border hover:bg-muted-foreground/20')
        break
    }
  }
  return styles
}

export const ChapterParts = ({
  chapterParts,
  courseSlug,
  chapterSlug,
  currentPartSlug,
}: {
  chapterParts: ChapterPartStatusInfo[]
  courseSlug: string
  chapterSlug: string
  currentPartSlug: string
}) => {
  const { partsWithStatus, isLoading } = useUserChapterPartsProgress({ chapterParts })

  if (isLoading) {
    return <div className="w-32 h-4 bg-muted rounded-full animate-pulse mx-4" />
  }

  return (
    <div className="flex-none flex justify-center items-center gap-2 mx-4">
      <TooltipProvider delayDuration={100} skipDelayDuration={0}>
        {partsWithStatus.map((part) => (
          <Tooltip key={part.id}>
            <TooltipTrigger asChild>
              <Link href={`/courses/${courseSlug}/${chapterSlug}/${part.slug}`}>
                <div className={getPartStyle(part, currentPartSlug)} />
              </Link>
            </TooltipTrigger>
            <TooltipContentCustom side="top">
              <p>{part.name}</p>
            </TooltipContentCustom>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
