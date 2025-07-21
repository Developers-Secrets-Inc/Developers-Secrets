'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { FeedbackDialog } from './feedback-dialog' // Assuming it's in the same directory
import { useSessionUser } from '@/core/user/hooks/use-user'

interface FeedbackButtonProps {
  partId: number
  partName: string
}

export function FeedbackButton({ partId, partName }: FeedbackButtonProps) {
  const user = useSessionUser()
  const userId = user.user?.id
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)

  if (!userId) {
    return null
  }

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setIsFeedbackDialogOpen(true)}
              aria-label="Submit Feedback / Report Issue"
            >
              <MoreVertical size={16} />
              <span className="sr-only">Submit Feedback</span>
            </Button>
          </TooltipTrigger>
          <TooltipContentCustom side="bottom" className="text-muted-foreground">
            <p>Submit Feedback / Report Issue</p>
          </TooltipContentCustom>
        </Tooltip>
      </TooltipProvider>

      <FeedbackDialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
        partId={partId}
        partName={partName}
        userId={userId}
      />
    </>
  )
}


