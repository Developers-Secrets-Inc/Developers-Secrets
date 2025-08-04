import { Button } from '@/components/ui/button'
import { isNone, Maybe } from '@/lib/maybe'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ChapterOutline } from '../../navigation/components/chapter-outline'
import { getNextPart, getPreviousPart } from '../../navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

type CourseFooterProps = {
  courseSlug: string
  partSlug: string
  chapterOutline: {
    id: number
    name: string
    slug: string
    completionStatus: 'not_started' | 'in_progress' | 'completed'
  }[]
}

export const PreviousPartButton = async ({
  courseSlug,
  partSlug,
}: {
  courseSlug: string
  partSlug: string
}) => {
  const previousPart = await getPreviousPart({ courseSlug, partSlug })

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={isNone(previousPart)}
      asChild
    >
      <Link href={isNone(previousPart) ? '#' : `/courses/${courseSlug}/${previousPart.value.chapterSlug}/${previousPart.value.slug}/description`}>
        <ChevronLeft className="h-4 w-4" />
        {isNone(previousPart) ? 'No previous part' : previousPart.value.name}
      </Link>
    </Button>
  )
}

export const NextPartButton = async ({
  courseSlug,
  partSlug,
}: {
  courseSlug: string
  partSlug: string
}) => {
  const nextPart = await getNextPart({ courseSlug, partSlug })

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={isNone(nextPart)}
      asChild
    >
      <Link href={isNone(nextPart) ? '#' : `/courses/${courseSlug}/${nextPart.value.chapterSlug}/${nextPart.value.slug}/description`}>
        {isNone(nextPart) ? 'No next part' : nextPart.value.name}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </Button>
  )
}

export const CourseFooter = ({ courseSlug, partSlug, chapterOutline }: CourseFooterProps) => {
  return (
    <footer className="flex-none py-2 px-4 bg-background border-t border-border h-14">
      <div className="flex items-center justify-between w-full h-full">
        <Suspense fallback={<Skeleton className="h-5 w-[100px]" />}>
          <PreviousPartButton courseSlug={courseSlug} partSlug={partSlug} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-2 w-[200px]" />}>
          <ChapterOutline outline={chapterOutline} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-5 w-[100px]" />}>
          <NextPartButton courseSlug={courseSlug} partSlug={partSlug} />
        </Suspense>
      </div>
    </footer>
  )
}
