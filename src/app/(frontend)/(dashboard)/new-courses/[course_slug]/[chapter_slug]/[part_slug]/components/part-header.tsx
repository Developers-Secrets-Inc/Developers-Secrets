import { AuthButtons } from '@/components/buttons/AuthButtons'
import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { CourseOutline } from '@/core/courses'
import { CourseOutlineSheetTrigger } from './course-outline-sheet-trigger'

export const PartHeader = ({
  courseOutline,
  courseSlug,
}: {
  courseOutline: CourseOutline
  courseSlug: string
}) => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-4 border-b px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Eclipse className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        <CourseOutlineSheetTrigger courseOutlineData={courseOutline} courseSlug={courseSlug} />
      </div>

      <div className="ml-auto">
        <AuthButtons />
      </div>
    </header>
  )
}
