'use client'

import { challengeTabs, TabConfig } from '../../tabs-config'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Tab } from './tab'
import { useChallengeTabsLockStatus } from '../hooks/use-challenge-tabs-lock-status'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useChallenge } from '../../contexts/challenge-context'
import { useUser } from '@/core/users/contexts/user-context'

export const ChallengeNavigationTabs = () => {
  const pathname = usePathname()
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const { challenge } = useChallenge()
  const { user } = useUser()

  const tabs = challengeTabs(challenge.slug, pathname)

  const {
    data: tabsLockStatus,
    unlockTab,
    isUnlocking,
  } = useChallengeTabsLockStatus({
    tabs,
    challengeSlug: challenge.slug,
    userId: user.id,
  })
  return (
    <>
      <nav className="h-12.5 flex-none border-b bg-background">
        <div className="flex h-full divide-x divide-border">
          {tabs.map((tab) => {
            const isLocked = tabsLockStatus ? tabsLockStatus[tab.id] : true
            return (
              <Tab
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
                href={isLocked ? '#' : tab.href}
                active={pathname === tab.href}
                locked={isLocked}
                onClick={isLocked ? () => setOpenDialog(tab.id) : undefined}
              />
            )
          })}
        </div>
      </nav>
      {tabs.map((tab) => {
        if (!tab.lock) {
          return null
        }

        return (
          <ChallengeTabDialog
            key={tab.id}
            isOpen={openDialog === tab.id}
            onClose={() => setOpenDialog(null)}
            onConfirm={() => unlockTab(tab.id)}
            title={tab.lock.dialog.title}
            description={tab.lock.dialog.description}
            confirmLabel={tab.lock.dialog.confirmLabel}
            isLoading={isUnlocking}
          />
        )
      })}
    </>
  )
}

const ChallengeTabDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel: string
  isLoading: boolean
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
