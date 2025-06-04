import { AuthButtons } from '@/components/buttons/AuthButtons'
import type { CourseOutlineUserData } from '@/core/courses/parts'
import { CourseOutlineSheetTrigger } from './course-outline-sheet-trigger'

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
        <CourseOutlineSheetTrigger courseOutlineData={courseOutlineData} courseSlug={courseSlug} />
      </div>

      <div className="ml-auto">
        <AuthButtons />
      </div>
    </header>
  )
}
