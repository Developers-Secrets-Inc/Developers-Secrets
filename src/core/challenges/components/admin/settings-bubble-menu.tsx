'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { ChallengeDescriptionDialog } from './challenge-description-dialog'
import { ChallengeSolutionDialog } from './challenge-solution-dialog'
import { ChallengeTestsDialog } from './challenge-tests-dialog'
import { ChallengeSolutionUnlockDialog } from './challenge-solution-unlock-dialog'
import { ChallengeCompletionStatusDialog } from './challenge-completion-status-dialog'
import { Challenge } from '@/payload-types'

interface SettingsBubbleMenuProps {
  challenge: Challenge
}

export function SettingsBubbleMenu({ challenge }: SettingsBubbleMenuProps) {
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [isSolutionDialogOpen, setIsSolutionDialogOpen] = useState(false)
  const [isTestsDialogOpen, setIsTestsDialogOpen] = useState(false)
  const [isSolutionUnlockDialogOpen, setIsSolutionUnlockDialogOpen] = useState(false)
  const [isCompletionStatusDialogOpen, setIsCompletionStatusDialogOpen] = useState(false)

  const handleSaveDescription = (newDescription: string) => {
    // Logic to save description (will be handled by the hook in the dialog)
    console.log('Saving new description:', newDescription)
  }

  const handleSaveSolution = (newSolution: string) => {
    // Logic to save solution (will be handled by the hook in the dialog)
    console.log('Saving new solution:', newSolution)
  }

  return (
    <>
      <DropdownMenuContent align="end" sideOffset={10} className="w-56">
        <DropdownMenuLabel>Challenge Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setIsDescriptionDialogOpen(true)
            }}
          >
            Edit Description
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setIsSolutionDialogOpen(true)
            }}
          >
            Edit Official Solution
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setIsTestsDialogOpen(true)
            }}
          >
            Edit Tests
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setIsSolutionUnlockDialogOpen(true)
            }}
          >
            Toggle Solution Unlock
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setIsCompletionStatusDialogOpen(true)
            }}
          >
            Set Completion Status
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      <ChallengeDescriptionDialog
        slug={challenge.slug}
        initialDescription={challenge.description?.statement || ''}
        open={isDescriptionDialogOpen}
        onOpenChange={setIsDescriptionDialogOpen}
      />
      <ChallengeSolutionDialog
        slug={challenge.slug}
        initialSolution={challenge.officialSolution?.statement || ''}
        open={isSolutionDialogOpen}
        onOpenChange={setIsSolutionDialogOpen}
      />
      <ChallengeTestsDialog
        challenge={challenge}
        open={isTestsDialogOpen}
        onOpenChange={setIsTestsDialogOpen}
      />
      <ChallengeSolutionUnlockDialog
        challenge={challenge}
        open={isSolutionUnlockDialogOpen}
        onOpenChange={setIsSolutionUnlockDialogOpen}
      />
      <ChallengeCompletionStatusDialog
        challenge={challenge}
        open={isCompletionStatusDialogOpen}
        onOpenChange={setIsCompletionStatusDialogOpen}
      />
    </>
  )
}
