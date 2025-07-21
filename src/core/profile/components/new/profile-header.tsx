import { UserProfile } from '@/core/profile/actions' // Assuming type exists
import { UserAvatar } from './user-avatar'
import { UserName } from './user-name'
import { UserDescription } from './user-bio'
import { ProfileOptionsButton } from './profile-options-button'
import { MessageUserButton } from './message-user-button'
import { FollowingStatusButton } from './following-status-button'
import { Button } from '@/components/ui/button' // For Edit button

interface ProfileHeaderProps {
  userProfile: UserProfile | null // Pass the whole profile
  isOwnProfile: boolean
}

// Placeholder Bio - Will be refined when UserProfile type is fixed
const getBio = (profile: UserProfile | null) =>
  (profile as any)?.bio || 'Frontend developer passionate about crafting interfaces.'

export const ProfileHeader = ({ userProfile, isOwnProfile }: ProfileHeaderProps) => {
  if (!userProfile) return null // Handle null profile case

  const userBio = getBio(userProfile)

  return (
    <div className="px-12">
      <div className="relative flex items-center gap-6">
        <div>
          <UserAvatar
            className="h-32 w-32 border-5 border-background" /* src={userProfile.avatarUrl} */
          />
        </div>
        <div className="flex-grow">
          <UserName name={userProfile.name || 'User Name'} />
          <UserDescription description={userBio} />
        </div>
        <div className="flex items-center gap-2">
          <ProfileOptionsButton />
          <MessageUserButton userSlug={(userProfile as any).slug} /> {/* Fix type later */}
          <FollowingStatusButton />
        </div>
      </div>
    </div>
  )
}
