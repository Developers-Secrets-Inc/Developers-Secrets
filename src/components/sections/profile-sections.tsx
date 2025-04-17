import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Star, UserPlus, UserCheck, Award, BookOpen, Camera, Pencil, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import * as Tooltip from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { getFollowers, getFollowing, isFollowing } from '@/core/profile/follow'
import { FollowButton } from '@/components/profile/follow-button'
import { User } from '@/types/user'

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
  followersCount: number
  followingCount: number
  currentUserId: string
  followers: User[]
  following: User[]
}

export const ProfileInfoSection = async ({
  user,
  isOwnProfile,
  followersCount,
  followingCount,
  currentUserId,
  followers,
  following,
}: ProfileInfoSectionProps) => {
  const xpPercentage = (user.experience / user.maxExperience) * 100
  const currentlyFollowing = !isOwnProfile ? await isFollowing(currentUserId, user.id) : false

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
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
              <TooltipContentCustom side="top" align="center" sideOffset={5}>
                Changer la photo de profil
              </TooltipContentCustom>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>

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
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Experience</span>
          <span className="text-muted-foreground">
            {user.experience} / {user.maxExperience} XP
          </span>
        </div>
        <Progress value={xpPercentage} className="h-2" />
      </div>

      {isOwnProfile ? (
        <Button className="w-full" variant="outline">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      ) : (
        <FollowButton
          userId={currentUserId}
          targetUserId={user.id}
          initialIsFollowing={currentlyFollowing}
          initialFollowersCount={followersCount}
          initialFollowingCount={followingCount}
          followers={followers}
          following={following}
        />
      )}
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
