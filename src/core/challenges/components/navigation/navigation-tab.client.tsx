'use client'

import { cn } from '@/lib/utils'
import { NavigationTab as NavigationTabServer } from './navigation-tab'
import type { TabProps } from './navigation-tab'

/**
 * Props for the client-side NavigationTab component
 * Extends the base TabProps with interactive functionality
 */
type NavigationTabProps = TabProps & {
  /** Callback function called when the tab is clicked */
  onClick: () => void
  /** Whether the tab's content is locked and requires confirmation to access */
  isLocked: boolean
}

/**
 * A client component that wraps the server NavigationTab with interactivity.
 * This component handles click events and visual states for locked content.
 *
 * @example
 * ```tsx
 * <NavigationTab
 *   name="Solutions"
 *   icon={LockIcon}
 *   current={false}
 *   href="/challenges/my-challenge/solutions"
 *   onClick={handleTabClick}
 *   isLocked={true}
 * />
 * ```
 */
export function NavigationTab({ onClick, isLocked, ...props }: NavigationTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-none border border-r h-12 min-h-[48px] flex-1 cursor-pointer',
        props.current
          ? 'bg-muted after:bg-primary after:absolute after:pointer-events-none after:inset-x-0 after:bottom-0 after:h-0.5'
          : '',
        isLocked ? 'text-muted-foreground' : '',
        props.className,
      )}
    >
      <NavigationTabServer {...props} />
    </button>
  )
}
