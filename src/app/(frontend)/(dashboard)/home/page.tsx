import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
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
