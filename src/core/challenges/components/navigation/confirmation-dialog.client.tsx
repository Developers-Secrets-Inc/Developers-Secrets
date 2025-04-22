'use client'

import { Dialog } from '@/components/ui/dialog'
import { ConfirmationDialog as ConfirmationDialogServer } from './confirmation-dialog'

/**
 * Props for the client-side ConfirmationDialog component
 */
type ConfirmationDialogProps = {
  /** Whether the dialog is currently visible */
  open: boolean
  /** Callback function to handle opening/closing the dialog */
  onOpenChange: (open: boolean) => void
  /** Callback function called when the user confirms the action */
  onConfirm: () => void
}

/**
 * A client component that wraps the server ConfirmationDialog with interactivity.
 * This component handles the dialog's open state and user interactions.
 *
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   onConfirm={handleConfirmAction}
 * />
 * ```
 */
export function ConfirmationDialog({ open, onOpenChange, onConfirm }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ConfirmationDialogServer
        title="Confirmation"
        description="Are you sure you want to view the solution? This action cannot be undone."
        onConfirm={onConfirm}
        onCancel={() => onOpenChange(false)}
      />
    </Dialog>
  )
}
