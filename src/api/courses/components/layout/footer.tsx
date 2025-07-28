import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CoursePart = {
  name: string
  slug: string
}

type CourseFooterProps = {
  previousPart: CoursePart | null
  nextPart: CoursePart | null
  chapterOutline: {
    partName: string
    partSlug: string
    isCurrent: boolean
    completionStatus: 'not_started' | 'in_progress' | 'completed'
  }[]
}


export const CourseFooter = () => {
  return (
    <footer className="flex-none py-2 px-4 bg-background border-t border-border h-14">
      <div className="flex items-center justify-between w-full h-full">
        <Button variant="outline" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Previous Part
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          Next Part
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </footer>
  )
}
