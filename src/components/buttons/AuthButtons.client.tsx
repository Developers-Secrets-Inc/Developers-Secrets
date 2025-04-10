'use client'

import { UserDropdownMenu } from '@/core/user/components/user-dropdown-menu'
import { User } from '@/types/user'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'
import { NotificationButton } from '../sidebars/home-sidebar/notification-button'
interface AuthButtonsClientProps {
  user: User | null
}

export const AuthButtonsClient = ({ user }: AuthButtonsClientProps) => {
  return user ? (
    <div className="ml-auto flex items-center gap-2">
      <NotificationButton />

      <Button variant="outline" size="sm" asChild>
        <Link href="/home">Dashboard</Link>
      </Button>
      <UserDropdownMenu user={user} />
    </div>
  ) : (
    <div className="ml-auto flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/login">Log in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/auth/signup">Sign up</Link>
      </Button>
    </div>
  )
}
