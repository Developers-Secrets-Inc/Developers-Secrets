import { Button } from '@/components/ui/button'
import { isNone, Maybe } from '@/lib/maybe'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ChapterOutline } from '../../navigation/components/chapter-outline'

type CoursePart = {
  name: string
  slug: string
}

type CourseFooterProps = {
  courseSlug: string
  previousPart: Maybe<CoursePart>
  nextPart: Maybe<CoursePart>
  chapterOutline: {
    id: number
    name: string
    slug: string
    completionStatus: 'not_started' | 'in_progress' | 'completed'
  }[]
}

export const CourseFooter = ({ courseSlug, previousPart, nextPart, chapterOutline }: CourseFooterProps) => {
  return (
    <footer className="flex-none py-2 px-4 bg-background border-t border-border h-14">
      <div className="flex items-center justify-between w-full h-full">
        <Button variant="outline" className="flex items-center gap-2" disabled={isNone(previousPart)} asChild>
          <Link href={isNone(previousPart) ? '#' : `${courseSlug}/${previousPart.value.slug}/description`}>
          <ChevronLeft className="h-4 w-4" />
          {isNone(previousPart) ? 'No previous part' : previousPart.value.name}
          </Link>
        </Button>
        <ChapterOutline outline={chapterOutline} />
        <Button variant="outline" className="flex items-center gap-2" disabled={isNone(nextPart)} asChild>
          <Link href={isNone(nextPart) ? '#' : `${courseSlug}/${nextPart.value.slug}/description`}>
          {isNone(nextPart) ? 'No next part' : nextPart.value.name}
          <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </footer>
  )
}
