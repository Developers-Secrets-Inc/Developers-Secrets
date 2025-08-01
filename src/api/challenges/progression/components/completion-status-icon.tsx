import * as Tooltip from '@radix-ui/react-tooltip'
import {
    CheckCircle2Icon,
    CircleDotIcon
} from 'lucide-react'

import { TooltipContentCustom } from '@/components/tooltip-without-decoration'

import { UserChallengeCompletionStatus } from '@/payload-types'

export const CompletionStatusIcon = ({
  completionStatus,
}: {
  completionStatus: UserChallengeCompletionStatus['completionStatus']
}) => {
  return <div className="w-8">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="flex items-center justify-center">
              {completionStatus === 'in_progress' ? (
                <CircleDotIcon className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
              )}
            </div>
          </Tooltip.Trigger>
          <TooltipContentCustom sideOffset={2} align="center">
            {completionStatus === 'in_progress' ? 'In Progress' : 'Completed'}
          </TooltipContentCustom>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
}
