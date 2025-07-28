import { Accordion, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { List } from 'lucide-react'
import type { CourseOutline as CourseOutlineType } from '../types'

const CourseOutlineChaptersAccordion = ({
  chapters,
}: {
  chapters: CourseOutlineType['chapters']
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {chapters.map((chapter) => (
        <AccordionItem value={`chapter-${chapter.slug}`} id={chapter.slug}>
          <AccordionTrigger className="px-2 py-2.5 text-base font-medium hover:bg-muted/50 rounded-md hover:no-underline flex items-center">
            <span className="flex-grow text-left">{chapter.name}</span>
          </AccordionTrigger>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export const CourseOutline = ({ courseOutline }: { courseOutline: CourseOutlineType }) => {
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
          <CourseOutlineChaptersAccordion chapters={courseOutline.chapters} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
