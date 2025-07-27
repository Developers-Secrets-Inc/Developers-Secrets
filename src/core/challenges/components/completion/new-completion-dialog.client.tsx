'use client'

import { DialogPage, MultiPageDialog } from '@/components/multi-pages-dialog'
import { useChallengeTimer } from '../../hooks/use-challenge-timer'
import { useChallengeUIStore } from '@/api/challenges/stores/challenge-ui-store'



export function NewChallengeSuccessDialog({
  challengeId,
  pages
}: {
  challengeId: number
  pages: DialogPage[]
}) {
  const { isCompletionDialogOpen, closeCompletionDialog } = useChallengeUIStore()
  const { stopTimer } = useChallengeTimer(challengeId)

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      stopTimer()
    }
    closeCompletionDialog()
  }



  return (
    <MultiPageDialog open={isCompletionDialogOpen} onOpenChange={handleOpenChange} pages={pages} />
  )
}
