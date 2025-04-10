import { redirect } from 'next/navigation'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { CurrentCourseCard } from '@/components/cards/current-course-card'
import { ProfileCard } from '@/components/cards/profile-card'
import { ChallengeCard } from '@/components/cards/challenge-card'
import { LeaderboardCard } from '@/components/cards/leaderboard-card'
import { GuildCard } from '@/components/cards/guild-card'

export default async function Home() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }


  // return (
  //   <SidebarProvider>
  //     <HomeSidebar />
  //     <SidebarInset>
  //       <HomeHeader />
  //       <div className="flex flex-1 flex-col gap-6 max-w-[1400px] mx-auto py-8">
  //         <div className="flex flex-wrap gap-6">
  //           {/* Colonne de gauche : Cours actuel et Challenge */}
  //           <div className="flex-1 min-w-[300px] max-w-[700px] space-y-6">
  //             <CurrentCourseCard />
  //             <ChallengeCard />
  //           </div>

  //           {/* Colonne de droite : Profil et Leaderboard */}
  //           <div className="w-[360px] space-y-6">
  //             <ProfileCard />
  //             <LeaderboardCard />
  //           </div>
  //         </div>

  //         {/* Troisième rangée: Guilde (pleine largeur) */}
  //         <div className="w-full">
  //           <GuildCard />
  //         </div>
  //       </div>
  //     </SidebarInset>
  //   </SidebarProvider>
  // )
  return redirect('/challenges')
}
