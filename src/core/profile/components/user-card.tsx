'use client'

import { useState } from 'react'
import { User } from '@/core/users/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { UserMinus, Shield } from 'lucide-react'
import Link from 'next/link'
import { BlockUserDialog } from './block-user-dialog'
import { useFollowActions } from '../hooks'
import { useToast } from '@/components/ui/use-toast'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface UserCardProps {
  user: User
  type: 'followers' | 'following'
  currentUserId: string
  targetUserId: string
  isOwnProfile: boolean
}

export function UserCard({ user, type, currentUserId, targetUserId, isOwnProfile }: UserCardProps) {
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const { toast } = useToast()
  const { mutate: toggleFollow, isPending } = useFollowActions(currentUserId, user.id)

  const handleRemove = async () => {
    toggleFollow(undefined, {
      onSuccess: (result: { success: boolean; error?: string }) => {
        if (result.success) {
          toast({
            title: 'Success',
            description:
              type === 'followers'
                ? "The user doesn't follow you anymore"
                : "You don't follow this user anymore",
          })
        }
      },
    })
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-lg border">
        <Link
          href={`/profile/${user.informations?.name?.toLowerCase().replace(/\s+/g, '-') || user.id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.informations?.avatar} alt={user.informations?.name || 'User'} />
            <AvatarFallback>
              {user.informations?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.informations?.name || 'User'}</p>
            {user.informations?.role && (
              <p className="text-sm text-muted-foreground capitalize">{user.informations.role}</p>
            )}
          </div>
        </Link>

        {isOwnProfile && (
          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleRemove} disabled={isPending}>
                    <UserMinus className="h-4 w-4" />
                    <span className="sr-only">
                      {type === 'followers' ? 'Remove follower' : 'Unfollow'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {type === 'followers' ? 'Remove follower' : 'Unfollow'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setIsBlockDialogOpen(true)}>
                    <Shield className="h-4 w-4" />
                    <span className="sr-only">Block</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Block user</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      <BlockUserDialog
        isOpen={isBlockDialogOpen}
        onClose={() => setIsBlockDialogOpen(false)}
        user={user}
        currentUserId={currentUserId}
      />
    </>
  )
}
