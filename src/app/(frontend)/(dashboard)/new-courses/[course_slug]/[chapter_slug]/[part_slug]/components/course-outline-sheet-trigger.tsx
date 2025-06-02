'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
// Importer les composants Accordion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { List, Lock, CheckCircle, Circle, CircleDot } from 'lucide-react'
import React from 'react'
// Importer les types mis à jour depuis parts.ts
import type { CourseOutlineUserData } from '@/core/courses/parts'
import type { CompletionStatus } from '@/core/courses/progression/completion-status' // Import CompletionStatus
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
// Import Tooltip components for locked state explanation
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'

// Helper function to get style based on status (similar to PartFooter)
const getPartStatusStyle = (status: CompletionStatus, isCurrent: boolean) => {
  let styles = 'w-2 h-2 rounded-full border transition-colors flex-shrink-0 mr-2' // Base style

  if (isCurrent) {
    // Special style for the current part's dot (optional, maybe just rely on text style)
    styles = cn(styles, 'bg-primary border-primary ring-1 ring-primary/30 scale-110')
  } else {
    switch (status) {
      case 'completed':
        styles = cn(styles, 'bg-green-500 border-green-600')
        break
      case 'in_progress':
        styles = cn(styles, 'bg-amber-500 border-amber-600')
        break
      case 'not_started':
      default:
        styles = cn(styles, 'bg-muted border-border')
        break
    }
  }
  return styles
}

// Props avec le type mis à jour
interface CourseOutlineSheetTriggerProps {
  courseOutlineData: CourseOutlineUserData
  courseSlug: string
}

export const CourseOutlineSheetTrigger = ({
  courseOutlineData,
  courseSlug,
}: CourseOutlineSheetTriggerProps) => {
  const pathname = usePathname() // Pour savoir quelle partie est active

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
          <List className="h-4 w-4" />
          <span>Outline</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-xs p-0">
        {' '}
        {/* Ajuster largeur et padding */}
        <SheetHeader className="p-4 border-b">
          {' '}
          {/* Ajouter padding et bordure */}
          <SheetTitle>Course Outline</SheetTitle>
        </SheetHeader>
        <div className="py-4 px-2 overflow-y-auto h-[calc(100vh-theme(space.16)-theme(space.1))] scrollbar-hide">
          {' '}
          {/* Rendre scrollable */}
          <TooltipProvider delayDuration={100} skipDelayDuration={0}>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={`chapter-${pathname.split('/')[3]}`}
            >
              {' '}
              {/* Ouvrir le chapitre courant par défaut */}
              {courseOutlineData.map((chapter) => (
                <AccordionItem value={`chapter-${chapter.chapterSlug}`} key={chapter.chapterSlug}>
                  <AccordionTrigger
                    disabled={chapter.isLocked}
                    className={cn(
                      'px-2 py-2.5 text-base font-medium hover:bg-muted/50 rounded-md hover:no-underline flex items-center',
                      chapter.isLocked && 'cursor-not-allowed opacity-60',
                    )}
                  >
                    {chapter.isLocked && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block mr-2 flex-shrink-0">
                            <Lock className="h-3 w-3" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContentCustom side="right" sideOffset={10}>
                          <p>Complete prerequisite chapters first.</p>
                        </TooltipContentCustom>
                      </Tooltip>
                    )}
                    <span className="flex-grow text-left">{chapter.chapterName}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <ul className="pl-4 pr-1 space-y-1.5 mt-1">
                      {chapter.parts.map((part) => {
                        const partHref = `/courses/${courseSlug}/${chapter.chapterSlug}/${part.slug}`
                        const isCurrentPart = pathname === partHref
                        return (
                          <li key={part.slug} className="flex items-center gap-1">
                            {chapter.isLocked ? (
                              <>
                                <Lock className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
                                <span
                                  className={cn(
                                    'block text-sm py-1 px-2 rounded-md flex-grow',
                                    'text-muted-foreground opacity-60',
                                  )}
                                >
                                  {part.name}
                                </span>
                              </>
                            ) : (
                              <Link
                                href={partHref}
                                className={cn(
                                  'flex items-center text-sm py-1 px-2 rounded-md hover:bg-muted/50 flex-grow',
                                  isCurrentPart
                                    ? 'bg-muted text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground',
                                )}
                              >
                                <span className={getPartStatusStyle(part.status, isCurrentPart)} />
                                <span className="flex-grow">{part.name}</span>
                              </Link>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TooltipProvider>
        </div>
      </SheetContent>
    </Sheet>
  )
}
