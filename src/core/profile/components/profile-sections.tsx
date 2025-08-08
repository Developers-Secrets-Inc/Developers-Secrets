'use client'

import { FollowButton } from './follow-button'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { User } from '@/core/users/types'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Award, BookOpen, Pencil, Star, UserPlus, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { UserListDialog } from './user-list-dialog'
import { useFollowers, useFollowing } from '../hooks'
import { Skeleton } from '@/components/ui/skeleton'

interface UserProfile {
  id: string
  name: string
  avatar: string
  level: number
  experience: number
  maxExperience: number
  isPremium: boolean
}

interface ProfileInfoSectionProps {
  user: UserProfile
  isOwnProfile: boolean
  currentUserId: string
  isFollowing: boolean
}

const UserAvatar = ({ user, isOwnProfile }: { user: UserProfile; isOwnProfile: boolean }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="relative block w-full group">
            <div className="relative w-full aspect-square rounded-full overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                <AvatarFallback className="text-4xl">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </button>
        </Tooltip.Trigger>
        {isOwnProfile && (
          <TooltipContentCustom side="bottom" align="center" sideOffset={5}>
            Change profile picture
          </TooltipContentCustom>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

const UserInformations = ({ user }: { user: UserProfile }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          {user.isPremium && (
            <Badge className="bg-yellow-500/20 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
              <Star className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <Badge variant="secondary">Level {user.level}</Badge>
      </div>
    </div>
  )
}

const UserExperience = ({ user }: { user: UserProfile }) => {
  const xpPercentage = (user.experience / user.maxExperience) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Experience</span>
        <span className="text-muted-foreground">
          {user.experience} / {user.maxExperience} XP
        </span>
      </div>
      <Progress value={xpPercentage} className="h-2" />
    </div>
  )
}

export const ProfileInfoSection = ({
  user,
  isOwnProfile,
  currentUserId,
  isFollowing,
}: ProfileInfoSectionProps) => {
  const [showFollowersDialog, setShowFollowersDialog] = useState(false)
  const [showFollowingDialog, setShowFollowingDialog] = useState(false)
  const { data: followers = [], isLoading: isLoadingFollowers } = useFollowers(user.id)
  const { data: following = [], isLoading: isLoadingFollowing } = useFollowing(user.id)

  const isLoading = isLoadingFollowers || isLoadingFollowing

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <UserAvatar user={user} isOwnProfile={isOwnProfile} />
        <UserInformations user={user} />
      </div>
      <UserExperience user={user} />

      {isOwnProfile ? (
        <>
          {isLoading ? (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setShowFollowersDialog(true)}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">{followers.length}</span> followers
                </span>
              </button>
              <button
                onClick={() => setShowFollowingDialog(true)}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">{following.length}</span> following
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <FollowButton
          userId={currentUserId}
          targetUserId={user.id}
          initialIsFollowing={isFollowing}
        />
      )}

      <UserListDialog
        isOpen={showFollowersDialog}
        onClose={() => setShowFollowersDialog(false)}
        title="Followers"
        type="followers"
        currentUserId={currentUserId}
        targetUserId={user.id}
      />

      <UserListDialog
        isOpen={showFollowingDialog}
        onClose={() => setShowFollowingDialog(false)}
        title="Following"
        type="following"
        currentUserId={currentUserId}
        targetUserId={user.id}
      />
    </div>
  )
}

interface AchievementsSectionProps {
  userId: string
}

export const AchievementsSection = ({ userId }: AchievementsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Award className="h-5 w-5 text-yellow-500" />
        Achievements
      </h3>
      <p className="text-sm text-muted-foreground">No achievements yet</p>
    </div>
  )
}

interface CoursesSectionProps {
  userId: string
}

export const CoursesSection = ({ userId }: CoursesSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-green-500" />
        Completed Courses
      </h3>
      <p className="text-sm text-muted-foreground">No completed courses</p>
    </div>
  )
}
