'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus, UserCheck } from 'lucide-react'
import { UserListDialog } from './user-list-dialog'
import { useFollowers, useFollowing, useFollowActions } from '../hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { User } from '@/types/user'

interface FollowButtonProps {
  userId: string
  targetUserId: string
  initialIsFollowing: boolean
}

export function FollowStats({
  followersCount,
  followingCount,
  onShowFollowers,
  onShowFollowing,
  isLoading,
}: {
  followersCount: number
  followingCount: number
  onShowFollowers: () => void
  onShowFollowing: () => void
  isLoading: boolean
}) {
  if (isLoading) {
    return (
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
    )
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <button
        onClick={onShowFollowers}
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <UserPlus className="h-4 w-4 text-muted-foreground" />
        <span>
          <span className="font-medium">{followersCount}</span> followers
        </span>
      </button>
      <button
        onClick={onShowFollowing}
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <UserCheck className="h-4 w-4 text-muted-foreground" />
        <span>
          <span className="font-medium">{followingCount}</span> following
        </span>
      </button>
    </div>
  )
}

export function FollowButton({ userId, targetUserId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [showFollowersDialog, setShowFollowersDialog] = useState(false)
  const [showFollowingDialog, setShowFollowingDialog] = useState(false)

  const { data: followersData = [], isLoading: isLoadingFollowers } = useFollowers(targetUserId)
  const { data: followingData = [], isLoading: isLoadingFollowing } = useFollowing(targetUserId)
  const { mutate: toggleFollow, isPending } = useFollowActions(userId, targetUserId)

  const isLoading = isLoadingFollowers || isLoadingFollowing

  const handleToggleFollow = () => {
    // Mise à jour optimiste immédiate
    setIsFollowing(!isFollowing)
    toggleFollow(undefined, {
      onError: () => {
        // En cas d'erreur, on restaure l'état précédent
        setIsFollowing(isFollowing)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <FollowStats
          followersCount={0}
          followingCount={0}
          onShowFollowers={() => {}}
          onShowFollowing={() => {}}
          isLoading={true}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        className="w-full relative"
        variant="outline"
        onClick={handleToggleFollow}
        disabled={isPending}
      >
        {isFollowing ? (
          <>
            <UserMinus className="h-4 w-4 mr-2" />
            Unfollow
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Follow
          </>
        )}
      </Button>
      <FollowStats
        followersCount={followersData.length}
        followingCount={followingData.length}
        onShowFollowers={() => setShowFollowersDialog(true)}
        onShowFollowing={() => setShowFollowingDialog(true)}
        isLoading={false}
      />

      <UserListDialog
        isOpen={showFollowersDialog}
        onClose={() => setShowFollowersDialog(false)}
        title="Followers"
        type="followers"
        currentUserId={userId}
        targetUserId={targetUserId}
      />

      <UserListDialog
        isOpen={showFollowingDialog}
        onClose={() => setShowFollowingDialog(false)}
        title="Following"
        type="following"
        currentUserId={userId}
        targetUserId={targetUserId}
      />
    </div>
  )
}
