'use client'

import { ReactNode } from 'react'
import { useSidebar } from '@/components/ui/sidebar'

interface ShowOnlyOnIconSidebarProps {
  children: ReactNode
}

export function ShowOnlyOnIconSidebar({ children }: ShowOnlyOnIconSidebarProps) {
  const { state } = useSidebar()
  if (state !== 'collapsed') return null
  return <>{children}</>
}
