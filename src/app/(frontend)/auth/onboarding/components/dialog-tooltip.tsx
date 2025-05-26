import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Button } from '@/components/ui/button'
import { SkipOnboardingDialog } from '@/core/onboarding/components/skip-onboarding-button'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { LogOutIcon } from 'lucide-react'

export const DialogTooltip = ({ userId }: { userId: string }) => {
  return (
    <SkipOnboardingDialog userId={userId}>
      <Button
        variant="outline"
        size="icon"
        aria-label="Skip onboarding"
        className="absolute top-4 right-4"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <LogOutIcon size={16} aria-hidden="true" className="text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContentCustom className="px-2 py-1 text-xs z-20" side="left">
              Skip Onboarding
            </TooltipContentCustom>
          </Tooltip>
        </TooltipProvider>
      </Button>
    </SkipOnboardingDialog>
  )
}
