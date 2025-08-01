'use client'

import { FeedbackDialog } from '@/components/feedback-dialog'
import { useSpecificDialog } from '../stores/sidebar-dialogs-store'

export const FeedbackDialogWrapper = () => {
  const { isOpen, close } = useSpecificDialog('feedback')

  return (
    <FeedbackDialog 
      open={isOpen} 
      onOpenChange={close} 
    />
  )
}