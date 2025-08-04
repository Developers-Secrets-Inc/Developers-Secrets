'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Store } from 'lucide-react'
import { useSpecificDialog } from '../stores/sidebar-dialogs-store'
import { useUser } from '@/core/users/contexts/user-context'
import { useUserLevel } from '@/api/gamification/level/hooks/use-user-level'

export const MarketplaceInventory = () => {
  const { isOpen, close } = useSpecificDialog('marketplace')
  const { user } = useUser()
  const userId = user.id
  const { data: userLevel, isLoading: isLoadingLevel } = useUserLevel(userId)

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="w-5 h-5" />
            Marketplace
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {userLevel === undefined || userLevel >= 5 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Feature Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Marketplace system is under development and will be available soon!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Marketplace Locked</h3>
                <p className="text-sm text-muted-foreground">
                  The marketplace unlocks at level 5. Keep learning to unlock this feature!
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
