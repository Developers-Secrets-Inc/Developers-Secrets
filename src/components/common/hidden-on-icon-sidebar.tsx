'use client'

import { ReactNode } from 'react'
import { useSidebar } from '@/components/ui/sidebar'

interface HiddenOnIconSidebarProps {
  children: ReactNode
}

export function HiddenOnIconSidebar({ children }: HiddenOnIconSidebarProps) {
  const { state } = useSidebar()
  if (state === 'collapsed') return null
  return <>{children}</>
}
