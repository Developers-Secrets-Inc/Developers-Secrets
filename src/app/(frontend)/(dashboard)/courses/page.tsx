import { CoursesGrid } from '@/components/cards/courses-grid'
import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { getCoursesWithStartUrl } from '@/core/courses'
// Importer les composants de layout et la logique de /challenges
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
  UserProfile,
  UserProfileCardSkeleton,
} from '@/app/(frontend)/(dashboard)/challenges/components/user-profile' // Assumer que le chemin est correct
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { LearningPathCarousel } from '@/components/learning-paths/learning-path-carousel' // Importer le nouveau composant

export default async function Page() {
  // Récupérer l'utilisateur et les cours
  const user = await getUser()
  if (!user) {
    redirect('/auth/login')
  }
  const courses = await getCoursesWithStartUrl()

  return (
    // Utiliser le layout de /challenges
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto max-w-7xl px-4 mx-auto">
          <div className="flex flex-col gap-6 p-6 h-full">
            {/* Section supérieure avec deux colonnes */}
            <div className="flex gap-6">
              {/* Colonne de gauche: Cours actuel + Parcours */}
              <div className="flex-1 flex flex-col gap-6">
                <CurrentCourseCard />
                {/* Passer une prop pour limiter à 3 parcours */}
                <LearningPathCarousel maxItems={3} />
              </div>
              {/* Colonne de droite: Profil */}
              <div className="w-[360px] flex-shrink-0">
                <Suspense fallback={<UserProfileCardSkeleton />}>
                  <UserProfile user={user} />
                </Suspense>
              </div>
            </div>

            {/* Section Grille de Cours (reste en dessous) */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Available Courses</h2>
              <CoursesGrid courses={courses} userId={user.id} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
