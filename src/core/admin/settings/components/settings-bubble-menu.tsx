import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { NotificationsDialog } from './notifications-dialog'
import { useNotifications } from '@/core/notifications/notification-provider'

export function SettingsBubbleMenu() {
  const [openDialog, setOpenDialog] = useState(false)
  const { refetch } = useNotifications()

  return (
    <>
      <NotificationsDialog open={openDialog} onOpenChange={setOpenDialog} refetch={refetch} />
      <DropdownMenuContent align="end" sideOffset={10} className="w-56">
        <DropdownMenuLabel>Dashboard Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setOpenDialog(true)}>
          Create a notification
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  )
}
