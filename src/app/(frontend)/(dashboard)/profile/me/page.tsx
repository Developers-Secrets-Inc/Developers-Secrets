import { ProfileDivisionCard } from '@/core/profile/components/profile-division-card'
import { ProfileGuildCard } from '@/core/profile/components/profile-guild-card'
import { ProfileSkillsCard } from '@/core/profile/components/profile-skills-card'
import { Separator } from '@/components/ui/separator'
import {
  AchievementsSection,
  CoursesSection,
  ProfileInfoSection,
} from '@/core/profile/components/profile-sections'
import { getFollowers, getFollowing } from '@/core/profile/follow'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/core/profile/actions'

export default async function Page() {
  const userProfile = await getUserProfile()

  if (!userProfile) {
    redirect('/login')
  }

  return (
    <>
      {/* Colonne de gauche */}
      <div className="w-[330px] space-y-6 pl-8">
        <div className="space-y-6">
          <ProfileInfoSection
            user={userProfile}
            isOwnProfile={true}
            currentUserId={userProfile.id}
            isFollowing={false}
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
