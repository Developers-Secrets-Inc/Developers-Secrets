'use client'

import { useSidebar } from "@/components/ui/sidebar"



export const ConditionalSidebar = ({ onFalse, onTrue }: { onFalse: React.ReactNode, onTrue: React.ReactNode }) => {
  const { state } = useSidebar()
  if (state === 'collapsed') return onFalse
  return onTrue
}


