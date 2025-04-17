'use client'

import { useState } from 'react'
import { User } from '@/types/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { UserMinus, Shield } from 'lucide-react'
import Link from 'next/link'
import { BlockUserDialog } from './block-user-dialog'
import { removeFollower, removeFollowing } from '@/core/profile/actions'
import { useToast } from '@/components/ui/use-toast'

interface UserCardProps {
  user: User
  type: 'followers' | 'following'
  currentUserId: string
}

export function UserCard({ user, type, currentUserId }: UserCardProps) {
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isRemoved, setIsRemoved] = useState(false)
  const { toast } = useToast()

  const handleRemove = async () => {
    try {
      // Mise à jour optimiste
      setIsRemoved(true)

      if (type === 'followers') {
        await removeFollower(currentUserId, user.id)
      } else {
        await removeFollowing(currentUserId, user.id)
      }

      toast({
        title: 'Succès',
        description:
          type === 'followers'
            ? "L'utilisateur ne vous suit plus"
            : 'Vous ne suivez plus cet utilisateur',
      })
    } catch (error) {
      // Restaurer l'état en cas d'erreur
      setIsRemoved(false)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'action",
      })
    }
  }

  if (isRemoved) {
    return null
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-lg border">
        <Link
          href={`/profile/${user.id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.informations.avatar} alt={user.informations.name} />
            <AvatarFallback>
              {user.informations.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.informations.name}</p>
            {user.informations.role && (
              <p className="text-sm text-muted-foreground capitalize">{user.informations.role}</p>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRemove}>
            <UserMinus className="h-4 w-4" />
            <span className="sr-only">
              {type === 'followers' ? 'Retirer le follower' : 'Ne plus suivre'}
            </span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsBlockDialogOpen(true)}>
            <Shield className="h-4 w-4" />
            <span className="sr-only">Bloquer</span>
          </Button>
        </div>
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
