'use client'

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { ChevronRightIcon, Search } from 'lucide-react'

export const ArticleSidebarTrigger = () => {
  const { state } = useSidebar()
  return (
    state === 'collapsed' && (
      <div className="absolute top-4 left-4 border border-border rounded-lg flex items-center gap-2 p-1.5">
        <SidebarTrigger className="text-muted-foreground size-[18px]" />
        <Search className="text-muted-foreground size-[18px]" />
      </div>
    )
  )
}
