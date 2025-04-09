'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/core/user/components/user-avatar'
import { User } from '@/types/user'
import { BoltIcon, BookOpenIcon, Layers2Icon, LogOutIcon, PinIcon, UserPenIcon } from 'lucide-react'
import { useState } from 'react'
import { LogoutConfirmationDialog } from './dialogs/logout-confirmation-dialog'
import { SettingsDialog } from './dialogs/settings-dialog'

type UserDropdownMenuProps = {
  user: User
}

export const UserDropdownMenu = ({ user }: UserDropdownMenuProps) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <UserAvatar
              user={{
                avatarUrl: user.informations.avatar,
                initials: user.informations.initials,
              }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64" align="end" forceMount>
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {user.informations.name}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BoltIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Layers2Icon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Projects</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpenIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Documentation</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowSettingsDialog(true)}>
              <PinIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPenIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowLogoutDialog(true)}>
            <LogOutIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmationDialog
        showLogoutDialog={showLogoutDialog}
        setShowLogoutDialog={setShowLogoutDialog}
      />

      <SettingsDialog
        showSettingsDialog={showSettingsDialog}
        setShowSettingsDialog={setShowSettingsDialog}
        user={user}
      />
    </>
  )
}
