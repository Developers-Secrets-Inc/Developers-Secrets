import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * Props for the ConfirmationDialog component
 */
type DialogProps = {
  /** The title displayed at the top of the dialog */
  title: string
  /** The description text displayed below the title */
  description: string
  /** Callback function called when the user confirms the action */
  onConfirm: () => void
  /** Callback function called when the user cancels the action */
  onCancel: () => void
}

/**
 * A server component that renders a confirmation dialog with a title, description, and action buttons.
 * This is the base dialog component that handles the presentation layer only.
 * For interactivity, it needs to be wrapped by a client component.
 *
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item?"
 *   onConfirm={() => handleDelete()}
 *   onCancel={() => setOpen(false)}
 * />
 * ```
 */
export function ConfirmationDialog({ title, description, onConfirm, onCancel }: DialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  )
}


// TODO: This component is not challenge navigation specific. It should be extracted as a common component.
