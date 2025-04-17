import { SidebarInset } from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { redirect, notFound } from 'next/navigation'
import { ProfileDivisionCard } from '@/components/cards/profile-division-card'
import { ProfileGuildCard } from '@/components/cards/profile-guild-card'
import { ProfileSkillsCard } from '@/components/cards/profile-skills-card'
import { Separator } from '@/components/ui/separator'
import {
  ProfileInfoSection,
  AchievementsSection,
  CoursesSection,
} from '@/components/sections/profile-sections'
import { getUserProfile, getUserProfileBySlug } from '../actions'
import { getFollowers, getFollowing } from '@/core/profile/follow'

interface PageProps {
  params: Promise<{ user_slug: string }>
}

export default async function Page({ params }: PageProps) {
  const supabase = await createClient()
  const { user_slug } = await params

  // Vérifier si l'utilisateur est connecté
  const { data: sessionData } = await supabase.auth.getUser()
  if (!sessionData?.user) {
    redirect('/login')
  }

  // Récupérer le profil de l'utilisateur demandé
  const userProfile = await getUserProfileBySlug(user_slug)
  if (!userProfile) {
    notFound()
  }

  // Récupérer le profil de l'utilisateur connecté pour comparer
  const currentUserProfile = await getUserProfile()
  const isOwnProfile = currentUserProfile?.id === userProfile.id

  // Récupérer les followers et following
  const followers = await getFollowers(userProfile.id)
  const following = await getFollowing(userProfile.id)

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex flex-1 gap-8 max-w-[1400px] mx-auto py-8 px-4">
          {/* Colonne de gauche */}
          <div className="w-[300px] space-y-6">
            <div className="space-y-6">
              <ProfileInfoSection
                user={userProfile}
                isOwnProfile={isOwnProfile}
                followersCount={followers.length}
                followingCount={following.length}
                currentUserId={currentUserProfile?.id || ''}
                followers={followers}
                following={following}
              />
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
