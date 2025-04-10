'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { logoutSessionUser } from '@/core/user/auth'
import { redirect } from 'next/navigation'

type LogoutConfirmationDialogProps = {
  showLogoutDialog: boolean
  setShowLogoutDialog: (showLogoutDialog: boolean) => void
}

export const LogoutConfirmationDialog = ({
  showLogoutDialog,
  setShowLogoutDialog,
}: LogoutConfirmationDialogProps) => {
  const handleLogout = async () => {
    await logoutSessionUser()
    setShowLogoutDialog(false)
    redirect('/')
  }

  return (
    <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>Are you sure you want to log out of your account?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout}>Log out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
