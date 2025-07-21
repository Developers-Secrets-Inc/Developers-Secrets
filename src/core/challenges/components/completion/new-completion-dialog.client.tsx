'use client'

import { useChallengeEditorStore } from '@/core/compiler/challenge-editor/store'

import { DialogPage, MultiPageDialog } from '@/components/multi-pages-dialog'
import { useChallengeTimer } from '../../hooks/use-challenge-timer'



export function NewChallengeSuccessDialog({
  challengeId,
  pages
}: {
  challengeId: number
  pages: DialogPage[]
}) {
  const { showCompletionDialog, closeCompletionDialog } = useChallengeEditorStore()
  const { stopTimer } = useChallengeTimer(challengeId)

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      stopTimer()
    }
    closeCompletionDialog()
  }



  return (
    <MultiPageDialog open={showCompletionDialog} onOpenChange={handleOpenChange} pages={pages} />
  )
}
