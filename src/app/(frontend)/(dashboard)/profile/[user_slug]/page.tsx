import { SidebarInset } from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import { HomeSidebar } from '../../home/components/home-sidebar'
import { HomeHeader } from '../../home/components/home-header'
import { redirect } from 'next/navigation'
import { ProfileInfoCard } from '@/components/cards/profile-info-card'
import { ProfileDivisionCard } from '@/components/cards/profile-division-card'
import { ProfileAchievementsCard } from '@/components/cards/profile-achievements-card'
import { ProfileGuildCard } from '@/components/cards/profile-guild-card'
import { ProfileCoursesCard } from '@/components/cards/profile-courses-card'
import { ProfileSkillsCard } from '@/components/cards/profile-skills-card'

interface PageProps {
  params: Promise<{ user_slug: string }>
}

export default async function Page({ params }: PageProps) {
  const supabase = await createClient()
  const { user_slug } = await params

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex flex-1 flex-col gap-6 max-w-[1400px] mx-auto py-8">
          {/* Première ligne : Profil, Division et Amis */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[300px]">
              <ProfileInfoCard />
            </div>
            <div className="flex-1 min-w-[300px]">
              <ProfileDivisionCard />
            </div>
          </div>

          {/* Deuxième ligne : Achievements, Skills, Guild et Courses */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[300px] max-w-[700px] space-y-6">
              <ProfileAchievementsCard />
              <ProfileSkillsCard />
            </div>

            <div className="w-[360px] space-y-6">
              <ProfileGuildCard />
              <ProfileCoursesCard />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
