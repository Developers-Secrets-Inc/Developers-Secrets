'use client'

import { SupportDialog } from '@/components/support-dialog'
import { useSpecificDialog } from '../stores/sidebar-dialogs-store'

export const SupportDialogWrapper = () => {
  const { isOpen, close } = useSpecificDialog('support')

  // Default support status - in a real app, this might come from an API
  const supportStatus = {
    status: 'online' as const,
    message: 'Our support team is available to help you.',
  }

  return (
    <SupportDialog 
      open={isOpen} 
      onOpenChange={close} 
      supportStatus={supportStatus}
    />
  )
}