'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { User } from '@/types/user'
import { UserCard } from './user-card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface UserListDialogProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
  title: string
  type: 'followers' | 'following'
  currentUserId: string
}

export function UserListDialog({
  isOpen,
  onClose,
  users,
  title,
  type,
  currentUserId,
}: UserListDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 py-4">
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground">Aucun utilisateur trouvé</p>
            ) : (
              users.map((user) => (
                <UserCard key={user.id} user={user} type={type} currentUserId={currentUserId} />
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
