'use client'

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useCoursePart } from '@/core/courses/contexts/course-part-context'
import { cn } from '@/lib/utils'

export const CoursePartHints = () => {
  const part = useCoursePart()
  const hints = part.description?.hints

  if (!hints || hints.length === 0) {
    return null // Ne rien afficher s'il n'y a pas de hints
  }

  return (
    <div className="space-y-4 my-6">
      <h3 className="text-lg font-semibold">Hints</h3>
      <Accordion type="single" collapsible className="w-full">
        {hints.map((hint, index) => (
          <AccordionItem
            value={`hint-${index}`}
            key={`hint-${index}`}
            className={cn(
              'bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative px-4 py-1 outline-none has-focus-visible:z-10 has-focus-visible:ring-[3px]',
              'border-t first:border-b-0',
            )}
          >
            <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
              {`Hint ${index + 1}`}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2">
              {/* Plus tard, on pourrait ajouter une logique pour révéler le hint */}
              {hint.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
