import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { List } from 'lucide-react'
import Link from 'next/link'
import { getCourseOutline } from '@/api/courses/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { getUser } from '@/core/users'
import { isFailure } from '@/lib/result'
import { notFound } from 'next/navigation'
import type { CourseOutline as CourseOutlineType } from '../types'

export const CourseOutlineSkeleton = () => {
  return (
      <Skeleton className="h-5 w-[100px]" />
  )
}

const CourseOutlineChaptersAccordion = ({
  courseSlug,
  chapters,
}: {
  courseSlug: string
  chapters: CourseOutlineType['chapters']
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {chapters.map((chapter, index) => (
        <AccordionItem value={`chapter-${chapter.slug}`} id={`${chapter.slug}-${index}`}>
          <AccordionTrigger className="px-2 py-2.5 text-base font-medium hover:bg-muted/50 rounded-md hover:no-underline flex items-center">
            <span className="flex-grow text-left">{chapter.name}</span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="pl-4 pr-1 space-y-1.5 mt-1">
              {chapter.parts.map((part) => (
                <li key={part.slug} className="flex items-center gap-1">
                  <Link
                    href={`/courses/${courseSlug}/${chapter.slug}/${part.slug}/description`}
                    className="flex items-center text-sm py-1 px-2 rounded-md hover:bg-muted/50 flex-grow text-muted-foreground hover:text-foreground"
                  >
                    <span className="flex-grow">{part.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export const CourseOutline = async ({ courseSlug }: { courseSlug: string }) => {
  const [user, courseOutline] = await Promise.all([
    getUser(),
    getCourseOutline({ course_slug: courseSlug }),
  ])

  if (isFailure(user)) {
    return notFound()
  }

  // Check if course is draft and user is not admin
  const isAdmin = user.value.informations.role === 'admin'
  if (courseOutline.status === 'draft' && !isAdmin) {
    return notFound()
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'outline'} size={'sm'} className="gap-2 cursor-pointer">
          <List className="h-4 w-4" />
          <span>Outline</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Course Outline</SheetTitle>
          <CourseOutlineChaptersAccordion
            courseSlug={courseOutline.courseSlug}
            chapters={courseOutline.chapters}
          />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
