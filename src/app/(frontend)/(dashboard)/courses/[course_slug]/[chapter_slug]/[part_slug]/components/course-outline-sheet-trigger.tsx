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
import { List, Lock } from 'lucide-react'
import React from 'react'
// Importer le type des données de l'outline depuis le layout
import { CourseOutlineData } from '../layout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
// Import Tooltip components for locked state explanation
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'

interface CourseOutlineSheetTriggerProps {
  courseOutlineData: CourseOutlineData
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
                  {/* Rendre AccordionTrigger directement */}
                  <AccordionTrigger
                    disabled={chapter.isLocked}
                    className={cn(
                      'px-2 py-2 text-sm hover:bg-muted/50 rounded-md hover:no-underline flex items-center',
                      chapter.isLocked && 'cursor-not-allowed opacity-60',
                    )}
                  >
                    {/* Afficher l'icône Lock si nécessaire et appliquer le tooltip ici */}
                    {chapter.isLocked && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {/* Ajouter un span autour de l'icône pour que le trigger fonctionne bien */}
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
                    <ul className="pl-4 pr-1 space-y-1 mt-1">
                      {chapter.parts.map((part) => {
                        const partHref = `/courses/${courseSlug}/${chapter.chapterSlug}/${part.slug}`
                        const isCurrentPart = pathname === partHref
                        return (
                          <li key={part.slug} className="flex items-center">
                            {/* Logique pour les parties verrouillées (si le chapitre est verrouillé) */}
                            {chapter.isLocked ? (
                              <>
                                <Lock className="h-2.5 w-2.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                                <span
                                  className={cn(
                                    'block text-xs py-1 px-2 rounded-md flex-grow',
                                    'text-muted-foreground opacity-60',
                                  )}
                                >
                                  {part.name}
                                </span>
                              </>
                            ) : (
                              // Lien normal si le chapitre n'est pas verrouillé
                              <Link
                                href={partHref}
                                className={cn(
                                  'block text-xs py-1 px-2 rounded-md hover:bg-muted/50 flex-grow',
                                  isCurrentPart
                                    ? 'bg-muted text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground',
                                )}
                              >
                                {part.name}
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
