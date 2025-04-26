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
import { cn } from '@/lib/utils'
import { Award, FileText, ListChecks, Lock, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'

type TabDefinition = {
  name: string
  slug: string
  icon: LucideIcon
  requiresConfirmation: boolean
}

const tabDefinitions: TabDefinition[] = [
  {
    name: 'Description',
    slug: 'description',
    icon: FileText,
    requiresConfirmation: false,
  },
  {
    name: 'Official Solution',
    slug: 'official-solution',
    icon: Award,
    requiresConfirmation: true,
  },
  {
    name: 'Submissions',
    slug: 'submissions',
    icon: ListChecks,
    requiresConfirmation: false,
  },
]

// Updated NavigationTab to be a button and handle locked state
// Removed export as it might be internal to this component now
function NavigationTab({
  tab,
  onClick,
  isLocked,
  current,
  icon: Icon,
  className,
}: {
  tab: TabDefinition
  onClick: () => void
  isLocked: boolean
  current: boolean
  icon: LucideIcon
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked && !tab.requiresConfirmation}
      className={cn(
        'relative overflow-hidden rounded-none border-b border-r h-12 min-h-[48px] flex-1 flex items-center justify-center gap-1.5 cursor-pointer',
        'transition-colors',
        current
          ? 'bg-muted text-foreground after:bg-primary after:absolute after:pointer-events-none after:inset-x-0 after:bottom-0 after:h-0.5'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        isLocked ? 'cursor-pointer text-muted-foreground' : '',
        className,
      )}
      aria-current={current ? 'page' : undefined}
    >
      <Icon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
      <span className="leading-none">{tab.name}</span>
    </button>
  )
}

interface CourseNavigationProps {
  baseHref: string
}

export const CourseNavigation = ({ baseHref }: CourseNavigationProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const [unlockedPaths, setUnlockedPaths] = useState<string[]>(() =>
    tabDefinitions
      .filter((tab) => !tab.requiresConfirmation)
      .map((tab) => `${baseHref}/${tab.slug}`),
  )

  const isPathUnlocked = (path: string) => unlockedPaths.includes(path)

  const handleTabClick = (href: string, requiresConfirmation: boolean) => {
    if (requiresConfirmation && !isPathUnlocked(href)) {
      setShowConfirmDialog(true)
      setPendingPath(href)
      return
    }
    router.push(href)
  }

  const unlockPath = (path: string) => {
    setUnlockedPaths((prev) => [...prev, path])
    console.log(`Path ${path} unlocked visually.`)
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
          {tabDefinitions.map((tab, index) => {
            const href = `${baseHref}/${tab.slug}`
            const current = pathname === href
            const isLocked = tab.requiresConfirmation && !isPathUnlocked(href)
            const IconToShow = isLocked ? Lock : tab.icon

            return (
              <NavigationTab
                key={tab.name}
                tab={tab}
                onClick={() => handleTabClick(href, tab.requiresConfirmation)}
                isLocked={isLocked}
                current={current}
                icon={IconToShow}
                className={cn(index === tabDefinitions.length - 1 ? 'border-r-0' : '')}
              />
            )
          })}
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

// Reusable ConfirmationDialog component (similar to challenge-navigation)
// NOTE: De-commenting for now to fix usage error. Need to decide on shared location later.
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
            Are you sure you want to view the solution? This action cannot be undone (for now).
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
