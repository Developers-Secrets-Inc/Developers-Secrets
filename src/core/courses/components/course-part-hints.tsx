'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

type Hint = {
  content: string
  isVisible?: boolean | null
  id?: string | null
}

type Optional<T> = T | undefined | null

const HintAccordionItem = ({ hint, index }: { hint: Hint; index: number }) => {
  return (
    <AccordionItem
      value={`hint-${index}`}
      key={hint.id ?? `hint-${index}`}
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
  )
}

const HintsAccordion = ({ hints }: { hints: Hint[] }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {hints.map((hint: Hint, index: number) => (
        <HintAccordionItem key={hint.id ?? `hint-${index}`} hint={hint} index={index} />
      ))}
    </Accordion>
  )
}

export const CoursePartHints = ({ hints }: { hints: Optional<Hint[]> }) => {
  const HAS_HINTS = hints && hints.length > 0

  return HAS_HINTS && (
    <div className="space-y-4 my-6">
      <h3 className="text-lg font-semibold">Hints</h3>
      <HintsAccordion hints={hints} />
    </div>
  )
}
