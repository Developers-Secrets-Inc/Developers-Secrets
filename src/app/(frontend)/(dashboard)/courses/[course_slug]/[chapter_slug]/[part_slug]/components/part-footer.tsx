import { ChapterPartStatusInfo } from '@/core/courses/parts'
import { ChapterParts } from './footer/chapter-parts'
import { NextPartButton } from './footer/next-part-button'
import { PreviousPartButton } from './footer/previous-part-button'

interface PartFooterProps {
  prevPartUrl: string | null
  nextPartUrl: string | null
  chapterParts: ChapterPartStatusInfo[]
  currentPartSlug: string
  courseSlug: string
  chapterSlug: string
  userId: string | null
  currentChapterId: number | null
  initialLockNextButton: boolean
}

export const PartFooter = ({
  prevPartUrl,
  nextPartUrl,
  chapterParts,
  currentPartSlug,
  courseSlug,
  chapterSlug,
}: PartFooterProps) => {
  return (
    <footer className="flex-none flex items-center justify-between p-3 border-t bg-background shadow-[0_-1px_2px_rgba(0,0,0,0.05)] z-10">
      {/* Previous Button */}
      <div className="flex-1">
        <PreviousPartButton
          isFirstPart={prevPartUrl ? false : true}
          isStartOfChapter={false}
          href={prevPartUrl ?? ''}
        />
      </div>

      {/* Chapter Parts Indicator */}
      <ChapterParts
        chapterParts={chapterParts}
        courseSlug={courseSlug}
        chapterSlug={chapterSlug}
        currentPartSlug={currentPartSlug}
      />

      {/* Next Button - now fully handled by NextPartButton */}
      <div className="flex-1 text-right">
        <NextPartButton
          currentCourseSlug={courseSlug}
          currentChapterSlug={chapterSlug}
          currentPartSlug={currentPartSlug}
          initialNextPartUrl={nextPartUrl}
        />
      </div>
    </footer>
  )
}

/*  

- On peut ne pas avoir de partie précédente ou suivante. Techniquement, ces données sont connues au moment du build. On a juste pour chaque partie, si elle est la première ou la dernière du chapitre.
- Quand on arrive à la fin d'un chapitre, au lieu d'afficher "Next", on peut afficher "Next Chapter". 
- Quand on arrive au début d'un chapitre, au lieu d'afficher "Previous", on peut afficher "Previous Chapter".
- Quand on arrive à la fin d'un chapitre, il est possible que le chapitre suivant ne soit pas encore débloqué. On ne peut pas le savoir au moment du build. Il faut le vérifier à chaque fois qu'on arrive sur la page. Ou alors, on le mets en cache et on le revalide à chaque fois qu'on termine une partie 
- Toutes les parties d'un chapitre sont connues au moment du build et sont donc statiques. Par contre, le status individuel de chaque partie est dynamique.

*/
