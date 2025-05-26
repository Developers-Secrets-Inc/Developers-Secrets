'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircleAlertIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { updateOnboarding } from '@/core/onboarding'
// Removed unused import: import { getUser } from '@/core/user'

export const SkipOnboardingDialog = ({
  children,
  userId,
}: {
  children: React.ReactNode
  userId: string
}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleConfirm = async () => {
    setLoading(true)
    // Optionally, you could call a server action to mark onboarding as skipped here
    await updateOnboarding(userId, {
      skipped: true,
    })
    router.push('/home')
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      {/* AlertDialogContent from shadcn/ui includes a close button by default */}
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to skip onboarding? You can always complete it later from your
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        {/* Added pt-2 for top padding and adjusted flex for 50/50 buttons */}
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2">
          {/* Wrap buttons in a flex container to make them 50/50 */}
          <div className="flex gap-2 w-full">
            {/* Use asChild on AlertDialogCancel to wrap the Button */}
            <AlertDialogCancel asChild disabled={loading}>
              <Button variant="outline" className="w-full">Cancel</Button>
            </AlertDialogCancel>
            {/* Use asChild on AlertDialogAction to wrap the Button */}
            <AlertDialogAction asChild>
              <Button onClick={handleConfirm} disabled={loading} className="w-full">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loader border-2 border-t-transparent border-primary rounded-full w-4 h-4 animate-spin" />
                    Skipping...
                  </span>
                ) : (
                  'Confirm'
                )}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
