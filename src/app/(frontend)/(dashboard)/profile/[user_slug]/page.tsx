import { ProfileDivisionCard } from '@/core/profile/components/profile-division-card'
import { ProfileGuildCard } from '@/core/profile/components/profile-guild-card'
import { ProfileSkillsCard } from '@/core/profile/components/profile-skills-card'
import {
  AchievementsSection,
  CoursesSection,
  ProfileInfoSection,
} from '@/core/profile/components/profile-sections'
import { Separator } from '@/components/ui/separator'
import { isFollowing } from '@/core/profile/follow'
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getUserProfile, getUserProfileBySlug } from '@/core/profile/actions'

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

  return (
    <>
      {/* Colonne de gauche */}
      <div className="w-[330px] space-y-6 pl-8">
        <div className="space-y-6">
          <ProfileInfoSection
            user={userProfile}
            isOwnProfile={isOwnProfile}
            currentUserId={currentUserProfile?.id || ''}
            isFollowing={
              !isOwnProfile
                ? await isFollowing(currentUserProfile?.id || '', userProfile.id)
                : false
            }
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
    </>
  )
}
