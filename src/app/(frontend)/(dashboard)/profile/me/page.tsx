import { SidebarInset } from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { redirect } from 'next/navigation'
import { ProfileDivisionCard } from '@/components/cards/profile-division-card'
import { ProfileGuildCard } from '@/components/cards/profile-guild-card'
import { ProfileSkillsCard } from '@/components/cards/profile-skills-card'
import { Separator } from '@/components/ui/separator'
import {
  ProfileInfoSection,
  AchievementsSection,
  CoursesSection,
} from '@/components/sections/profile-sections'
import { getUserProfile } from '../actions'

export default async function Page() {
  const userProfile = await getUserProfile()

  if (!userProfile) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex flex-1 gap-8 max-w-[1400px] mx-auto py-8 px-4">
          {/* Colonne de gauche */}
          <div className="w-[300px] space-y-6">
            <div className="space-y-6">
              <ProfileInfoSection user={userProfile} isOwnProfile={true} />
              <Separator />
              <AchievementsSection userId={userProfile.id} />
              <Separator />
              <CoursesSection userId={userProfile.id} />
            </div>
          </div>

          {/* Colonne de droite */}
          <div className="flex-1 space-y-6">
            <ProfileSkillsCard />
            <div className="grid grid-cols-2 gap-6">
              <ProfileDivisionCard />
              <ProfileGuildCard />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
