import { AuthGuard } from '@/components/auth/auth-guard'
import { CoursesGrid } from '@/components/cards/courses-grid'
import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { getCoursesWithStartUrl } from '@/core/courses'

export default async function Page() {
  const courses = await getCoursesWithStartUrl()

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="flex flex-1 flex-col gap-6 max-w-[1400px] mx-auto py-8">
          <div className="flex flex-wrap gap-6">
            {/* Colonne de gauche : Cours actuel et Challenge */}
            <div className="flex-1 min-w-[300px] max-w-[700px] space-y-6">
              <CurrentCourseCard />
            </div>
          </div>

          {/* Troisième rangée: Guilde (pleine largeur) */}
          <div className="w-full">
            <CoursesGrid courses={courses} />
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
