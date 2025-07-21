'use client'

import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/common/link-button'
import { TooltipProvider, Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { ChevronRight, Lock } from 'lucide-react'
import { useNextPartButton } from '@/core/courses/hooks/use-next-part-button'

interface NextPartButtonProps {
  currentCourseSlug: string
  currentChapterSlug: string
  currentPartSlug: string
  initialNextPartUrl?: string | null
}

export const NextPartButton = ({
  currentCourseSlug,
  currentChapterSlug,
  currentPartSlug,
  initialNextPartUrl = null,
}: NextPartButtonProps) => {
  const { nextPartUrl, isLocked, isEndOfChapter, isLoading } = useNextPartButton({
    currentCourseSlug,
    currentChapterSlug,
    currentPartSlug,
    initialNextPartUrl,
  })

  const content = isEndOfChapter ? 'Next Chapter' : 'Next Part'

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <ChevronRight className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (isLocked) {
    return (
      <TooltipProvider delayDuration={100} skipDelayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button variant="outline" disabled className="cursor-not-allowed">
                <Lock className="h-4 w-4 mr-2" />
                {content}
                <ChevronRight className="h-4 w-4 ml-2 opacity-50" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContentCustom side="top">
            <p>Complete all parts in this chapter to unlock the next one.</p>
          </TooltipContentCustom>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!nextPartUrl) {
    return (
      <Button variant="outline" disabled>
        {content}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    )
  }

  return (
    <LinkButton variant="outline" href={nextPartUrl}>
      {content}
      <ChevronRight className="h-4 w-4 ml-2" />
    </LinkButton>
  )
}
