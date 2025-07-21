'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useNavigationState } from '@/core/challenges/hooks/use-navigation-state'
import { cn } from '@/lib/utils'
import { Award, FileText, ListChecks, Lock, LucideIcon, Users } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

type Tab = {
  name: string
  href: string
  icon: LucideIcon
  current: boolean
  requiresConfirmation: boolean
}



function useTabsConfiguration(challengeSlug: string, pathname: string, unlockedPaths: string[]) {
  return useMemo(
    () => [
      {
        name: 'Description',
        href: `/challenges/${challengeSlug}/description`,
        icon: FileText,
        current: pathname === `/challenges/${challengeSlug}/description`,
        requiresConfirmation: false,
      },
      {
        name: 'Official Solution',
        href: `/challenges/${challengeSlug}/official-solution`,
        icon: unlockedPaths.includes(`/challenges/${challengeSlug}/official-solution`)
          ? Award
          : Lock,
        current: pathname === `/challenges/${challengeSlug}/official-solution`,
        requiresConfirmation: true,
      },
      {
        name: 'Solutions',
        href: `/challenges/${challengeSlug}/solutions`,
        icon: unlockedPaths.includes(`/challenges/${challengeSlug}/solutions`) ? Users : Lock,
        current: pathname.startsWith(`/challenges/${challengeSlug}/solutions`),
        requiresConfirmation: true,
      },
      {
        name: 'Submissions',
        href: `/challenges/${challengeSlug}/submissions`,
        icon: ListChecks,
        current: pathname.startsWith(`/challenges/${challengeSlug}/submissions`),
        requiresConfirmation: false,
      },
    ],
    [challengeSlug, pathname, unlockedPaths],
  )
}

function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to view the solution? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function NavigationTab({
  tab,
  onClick,
  isLocked,
}: {
  tab: Tab
  onClick: () => void
  isLocked: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-none border border-r h-12 min-h-[48px] flex-1 flex items-center justify-center gap-1.5 cursor-pointer',
        tab.current
          ? 'bg-muted after:bg-primary after:absolute after:pointer-events-none after:inset-x-0 after:bottom-0 after:h-0.5'
          : '',
        isLocked ? 'cursor-pointer text-muted-foreground' : '',
      )}
    >
      <div className="flex items-center justify-center gap-1.5">
        <tab.icon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
        <span className="leading-none">{tab.name}</span>
      </div>
    </button>
  )
}

export function ChallengeNavigation({
  challengeSlug,
  challengeId,
  userId,
}: {
  challengeSlug: string
  challengeId: number
  userId: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    state: { showConfirmDialog, pendingPath, unlockedPaths },
    setShowConfirmDialog,
    setPendingPath,
    unlockPath,
    isPathUnlocked,
  } = useNavigationState({}, challengeId, userId, challengeSlug)

  const tabs = useTabsConfiguration(challengeSlug, pathname, unlockedPaths)

  useEffect(() => {
    tabs.forEach((tab) => {
      if (!tab.current) {
        router.prefetch(tab.href)
      }
    })
  }, [tabs, router])

  const handleTabClick = (href: string, requiresConfirmation: boolean) => {
    if (requiresConfirmation && !isPathUnlocked(href)) {
      setShowConfirmDialog(true)
      setPendingPath(href)
      return
    }
    router.push(href)
  }

  const handleConfirm = () => {
    if (pendingPath) {
      const pathToNavigate = pendingPath
      setShowConfirmDialog(false)
      setPendingPath(null)
      unlockPath(pathToNavigate)
      router.push(pathToNavigate)
    }
  }

  return (
    <>
      <nav className="h-12 flex-none border-b bg-background">
        <div className="flex h-full">
          {tabs.map((tab) => (
            <NavigationTab
              key={tab.name}
              tab={tab}
              onClick={() => handleTabClick(tab.href, tab.requiresConfirmation)}
              isLocked={tab.requiresConfirmation && !isPathUnlocked(tab.href)}
            />
          ))}
        </div>
      </nav>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirm}
      />
    </>
  )
}
