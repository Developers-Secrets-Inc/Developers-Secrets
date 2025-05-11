'use client' // Assuming client-side interaction might be needed later

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react' // Import Lock icon
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { cn } from '@/lib/utils'
import { ChapterPartStatusInfo } from '../layout' // Importer le type depuis layout
// Import the hook for chapter progress
import { useUserChapterProgress } from '@/core/courses/progression/hooks/useUserChapterProgress'
import { useState, useEffect } from 'react'

interface PartFooterProps {
  prevPartUrl: string | null
  nextPartUrl: string | null
  chapterParts: ChapterPartStatusInfo[] // Tableau des parties du chapitre avec statut
  currentPartSlug: string
  courseSlug: string
  chapterSlug: string
  // --- Updated Props ---
  userId: string | null
  currentChapterId: number | null // ID of the current chapter
  initialLockNextButton: boolean // Add the new prop for initial server state
}

export const PartFooter = ({
  prevPartUrl,
  nextPartUrl,
  chapterParts,
  currentPartSlug,
  courseSlug,
  chapterSlug,
  userId,
  currentChapterId, // Use currentChapterId
  initialLockNextButton, // Accept the prop
}: PartFooterProps) => {
  // Use useState for the lock state, initialized from the server prop
  const [lockNextButton, setLockNextButton] = useState(initialLockNextButton)
  let isNavigationToNextChapter = false

  // Determine if the next URL points to a different chapter
  if (nextPartUrl) {
    const urlParts = nextPartUrl.split('/')
    if (urlParts.length === 5) {
      const nextChapterSlugFromUrl = urlParts[3]
      if (nextChapterSlugFromUrl !== chapterSlug) {
        isNavigationToNextChapter = true
      }
    }
  }

  // Fetch the status of the CURRENT chapter if navigating to a new chapter
  const { status: currentChapterStatus, isInitialLoading } = useUserChapterProgress({
    chapterId: currentChapterId ?? 0, // Use currentChapterId
    userId: userId,
    // Enable the hook only if userId and currentChapterId are valid
    // We need the status if we *might* navigate to the next chapter
    enabled: isNavigationToNextChapter && !!userId && !!currentChapterId,
  })

  // Update the lock state based on the hook after initial render
  useEffect(() => {
    let shouldLock = false
    if (isNavigationToNextChapter && !isInitialLoading && currentChapterStatus !== 'completed') {
      shouldLock = true
    }
    // Only update state if it differs from the current state
    if (shouldLock !== lockNextButton) {
      setLockNextButton(shouldLock)
    }
    // Dependencies: hook results and derived flags
  }, [isNavigationToNextChapter, isInitialLoading, currentChapterStatus, lockNextButton])

  const getPartStyle = (part: ChapterPartStatusInfo) => {
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

  return (
    <footer className="flex-none flex items-center justify-between p-3 border-t bg-background shadow-[0_-1px_2px_rgba(0,0,0,0.05)] z-10">
      {/* Previous Button */}
      <div className="flex-1">
        {prevPartUrl ? (
          <Button variant="outline" asChild>
            <Link href={prevPartUrl}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
      </div>

      {/* Chapter Parts Indicator */}
      <div className="flex-none flex justify-center items-center gap-2 mx-4">
        <TooltipProvider delayDuration={100} skipDelayDuration={0}>
          {chapterParts.map((part) => (
            <Tooltip key={part.id}>
              <TooltipTrigger asChild>
                <Link href={`/courses/${courseSlug}/${chapterSlug}/${part.slug}`}>
                  <div className={getPartStyle(part)} />
                </Link>
              </TooltipTrigger>
              <TooltipContentCustom side="top">
                <p>{part.name}</p>
              </TooltipContentCustom>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Next Button - Updated locking logic */}
      <div className="flex-1 text-right">
        {nextPartUrl && !lockNextButton ? (
          // Case 1: Next part exists and is NOT locked
          <Button variant="outline" asChild>
            <Link href={nextPartUrl}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        ) : nextPartUrl && lockNextButton ? (
          // Case 2: Next part exists but IS locked (because current chapter not complete)
          // Wrap the disabled button with Tooltip components
          <TooltipProvider delayDuration={100} skipDelayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Disabled button acts as the trigger. 
                    Need to wrap in span for TooltipTrigger to work correctly with disabled buttons */}
                <span tabIndex={0}>
                  <Button variant="outline" disabled className="cursor-not-allowed">
                    <Lock className="h-4 w-4 mr-2" /> {/* Lock Icon */}
                    {' Next'}
                    <ChevronRight className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContentCustom side="top">
                <p>Complete all parts in this chapter to unlock the next one.</p>
              </TooltipContentCustom>
            </Tooltip>
          </TooltipProvider>
        ) : (
          // Case 3: No next part exists
          <Button variant="outline" disabled>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </footer>
  )
}
