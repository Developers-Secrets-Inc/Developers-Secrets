'use client'

import { SidebarMenuBadge, SidebarMenuButton } from '@/components/ui/sidebar'
import { HelpCircle } from 'lucide-react'

type SupportStatus = 'online' | 'maintenance' | 'offline'

export const SupportStatusBadge = ({ status }: { status: SupportStatus }) => {
  const statusColor: Record<SupportStatus, string> = {
    online: 'bg-emerald-500',
    maintenance: 'bg-amber-500',
    offline: 'bg-red-500',
  }

  return (
    <SidebarMenuBadge className="gap-1.5 rounded-sm">
      <span className={`size-1.5 rounded-full ${statusColor[status]}`} aria-hidden="true"></span>
      {status === 'online' ? 'Online' : status === 'maintenance' ? 'Maintenance' : 'Offline'}
    </SidebarMenuBadge>
  )
}

export const SupportButton = ({ status }: { status: SupportStatus }) => {
  return (
    <SidebarMenuButton className="cursor-pointer flex justify-between w-full" tooltip={'feedback'}>
      <span className="flex items-center gap-2">
        <HelpCircle className="size-4" />
        Support
      </span>
      <SupportStatusBadge status={status} />
    </SidebarMenuButton>
  )
}
