'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { User } from '@/core/users/types'
import { UserCard } from './user-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useFollowers, useFollowing } from '../hooks'

interface UserListDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  type: 'followers' | 'following'
  currentUserId: string
  targetUserId: string
}

export function UserListDialog({
  isOpen,
  onClose,
  title,
  type,
  currentUserId,
  targetUserId,
}: UserListDialogProps) {
  const { data: followers, isLoading: isLoadingFollowers } = useFollowers(targetUserId)
  const { data: following, isLoading: isLoadingFollowing } = useFollowing(targetUserId)

  const users = type === 'followers' ? followers : following
  const isLoading = type === 'followers' ? isLoadingFollowers : isLoadingFollowing
  const isOwnProfile = currentUserId === targetUserId

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 py-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : users?.length === 0 ? (
              <p className="text-center text-muted-foreground">No users found</p>
            ) : (
              users?.map((user: User) => (
                <UserCard
                  key={user.id}
                  user={user}
                  type={type}
                  currentUserId={currentUserId}
                  targetUserId={targetUserId}
                  isOwnProfile={isOwnProfile}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
