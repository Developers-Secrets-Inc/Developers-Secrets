'use client'

import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Challenge } from '@/payload-types'
import { useState } from 'react'
import { ChallengeDescriptionDialog } from './challenge-description-dialog'
import { ChallengeSolutionDialog } from './challenge-solution-dialog'
import { ChallengeTestsDialog } from './challenge-tests-dialog'
import { useChallengeUIStore } from '@/api/challenges/stores/challenge-ui-store'

interface SettingsBubbleMenuProps {
  challenge: Challenge
}

export function SettingsBubbleMenu({ challenge }: SettingsBubbleMenuProps) {
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [isSolutionDialogOpen, setIsSolutionDialogOpen] = useState(false)
  const [isTestsDialogOpen, setIsTestsDialogOpen] = useState(false)
  const { openCompletionDialog } = useChallengeUIStore()

  return (
    <>
        <DropdownMenuContent align="end" sideOffset={10} className="w-56">
          <DropdownMenuLabel>Challenge Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={(event) => {
              event.preventDefault()
              setIsDescriptionDialogOpen(true)
            }}>
              Edit Description
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => {
              event.preventDefault()
              setIsSolutionDialogOpen(true)
            }}>
              Edit Official Solution
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => {
              event.preventDefault()
              setIsTestsDialogOpen(true)
            }}>
              Edit Tests
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => {
              event.preventDefault()
              openCompletionDialog()
            }}>
              Open completion dialog
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
    </>
  )
}