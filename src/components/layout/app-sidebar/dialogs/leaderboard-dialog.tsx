'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Trophy, Medal, Crown } from 'lucide-react'
import { useSpecificDialog } from '../stores/sidebar-dialogs-store'

export const LeaderboardDialog = () => {
  const { isOpen, close } = useSpecificDialog('leaderboard')

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Global Leaderboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
            <div className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Feature Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Global leaderboard is under development and will be available soon!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}