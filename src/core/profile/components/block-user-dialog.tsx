'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { User } from '@/core/users/types'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { addBlocked } from '@/core/profile/actions'

interface BlockUserDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User
  currentUserId: string
}

export function BlockUserDialog({ isOpen, onClose, user, currentUserId }: BlockUserDialogProps) {
  const [isBlocking, setIsBlocking] = useState(false)
  const { toast } = useToast()

  const handleBlock = async () => {
    try {
      setIsBlocking(true)
      await addBlocked(currentUserId, user.id)

      toast({
        title: 'Utilisateur bloqué',
        description: `${user.informations.name} a été bloqué avec succès.`,
      })

      onClose()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Une erreur est survenue lors du blocage de l'utilisateur.",
      })
    } finally {
      setIsBlocking(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bloquer {user.informations.name} ?</DialogTitle>
          <DialogDescription>
            Cette action empêchera {user.informations.name} de :
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Voir votre profil</li>
              <li>Vous suivre</li>
              <li>Interagir avec votre contenu</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isBlocking}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleBlock} disabled={isBlocking}>
            {isBlocking ? 'Blocage...' : 'Bloquer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
