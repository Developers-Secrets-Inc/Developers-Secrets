'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus, UserCheck } from 'lucide-react'
import { toggleFollowUser } from '@/core/profile/actions'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { UserListDialog } from './user-list-dialog'
import { User } from '@/types/user'

interface FollowButtonProps {
  userId: string
  targetUserId: string
  initialIsFollowing: boolean
  initialFollowersCount: number
  initialFollowingCount: number
  followers: User[]
  following: User[]
}

export function FollowStats({
  followersCount,
  followingCount,
  onShowFollowers,
  onShowFollowing,
}: {
  followersCount: number
  followingCount: number
  onShowFollowers: () => void
  onShowFollowing: () => void
}) {
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

export function FollowButton({
  userId,
  targetUserId,
  initialIsFollowing,
  initialFollowersCount,
  initialFollowingCount,
  followers,
  following,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followersCount, setFollowersCount] = useState(initialFollowersCount)
  const [followingCount, setFollowingCount] = useState(initialFollowingCount)
  const [showFollowersDialog, setShowFollowersDialog] = useState(false)
  const [showFollowingDialog, setShowFollowingDialog] = useState(false)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleToggleFollow = () => {
    // Mise à jour optimiste immédiate
    const wasFollowing = isFollowing
    setIsFollowing(!wasFollowing)
    setFollowersCount((prev) => (wasFollowing ? prev - 1 : prev + 1))

    // Action en arrière-plan
    startTransition(async () => {
      try {
        const result = await toggleFollowUser(userId, targetUserId)

        if (!result.success) {
          // Restaurer l'état précédent en cas d'erreur
          setIsFollowing(wasFollowing)
          setFollowersCount((prev) => (wasFollowing ? prev + 1 : prev - 1))

          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: result.error || 'Une erreur est survenue',
          })
        }
      } catch (error) {
        // Restaurer l'état précédent en cas d'erreur
        setIsFollowing(wasFollowing)
        setFollowersCount((prev) => (wasFollowing ? prev + 1 : prev - 1))

        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: "Une erreur est survenue lors de l'action",
        })
      }
    })
  }

  return (
    <div className="space-y-4">
      <Button className="w-full relative" variant="outline" onClick={handleToggleFollow}>
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
        followersCount={followersCount}
        followingCount={followingCount}
        onShowFollowers={() => setShowFollowersDialog(true)}
        onShowFollowing={() => setShowFollowingDialog(true)}
      />

      <UserListDialog
        isOpen={showFollowersDialog}
        onClose={() => setShowFollowersDialog(false)}
        users={followers}
        title="Followers"
        type="followers"
        currentUserId={userId}
      />

      <UserListDialog
        isOpen={showFollowingDialog}
        onClose={() => setShowFollowingDialog(false)}
        users={following}
        title="Following"
        type="following"
        currentUserId={userId}
      />
    </div>
  )
}
