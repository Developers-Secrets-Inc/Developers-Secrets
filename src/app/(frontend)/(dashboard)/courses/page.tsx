import { ProfileCard } from '@/core/profile/components/profile-card'
import { SidebarInset } from '@/components/ui/sidebar'
import { HomeHeader } from '../home/components/home-header'
import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { CoursesGrid } from '@/components/cards/courses-grid'
import { HomeSidebar } from '../home/components/home-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ChallengeCard } from '@/components/cards/challenge-card'
import { LeaderboardCard } from '@/components/cards/leaderboard-card'
import { GuildCard } from '@/components/cards/guild-card'

export default function Page() {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex flex-1 flex-col gap-6 max-w-[1400px] mx-auto py-8">
          <div className="flex flex-wrap gap-6">
            {/* Colonne de gauche : Cours actuel et Challenge */}
            <div className="flex-1 min-w-[300px] max-w-[700px] space-y-6">
              <CurrentCourseCard />
            </div>
          </div>

          {/* Troisième rangée: Guilde (pleine largeur) */}
          <div className="w-full">
            <CoursesGrid />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
