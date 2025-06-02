import { AuthButtons } from '@/components/buttons/AuthButtons'
import { Eclipse } from 'lucide-react'
import Link from 'next/link'
import { CourseOutlineSheetTrigger } from './course-outline-sheet-trigger'
import type { CourseOutlineUserData } from '@/core/courses/parts'

interface CoursePartMainHeaderProps {
  courseOutlineData: CourseOutlineUserData
  courseSlug: string
}

export const CoursePartMainHeader = ({
  courseOutlineData,
  courseSlug,
}: CoursePartMainHeaderProps) => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-4 border-b px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Eclipse className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        <CourseOutlineSheetTrigger courseOutlineData={courseOutlineData} courseSlug={courseSlug} />
      </div>

      <div className="ml-auto">
        <AuthButtons />
      </div>
    </header>
  )
}
