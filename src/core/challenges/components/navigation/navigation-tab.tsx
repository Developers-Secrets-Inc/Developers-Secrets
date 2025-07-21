import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

/**
 * Props for the NavigationTab component
 */
export type TabProps = {
  /** The text to display in the tab */
  name: string
  /** The URL that the tab links to */
  href: string
  /** The Lucide icon component to display next to the text */
  icon: LucideIcon
  /** Whether this tab is currently active */
  current: boolean
  /** Optional CSS classes to apply to the tab */
  className?: string
}

/**
 * A server component that renders a navigation tab with an icon and text.
 * This is the base presentation component without any interactivity.
 * For clickable tabs, it needs to be wrapped by a client component.
 *
 * @example
 * ```tsx
 * <NavigationTab
 *   name="Description"
 *   icon={FileText}
 *   current={true}
 *   href="/challenges/my-challenge/description"
 * />
 * ```
 */
export function NavigationTab({ name, icon: Icon, current, className }: TabProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 w-full h-full">
      <Icon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
      <span className="leading-none">{name}</span>
    </div>
  )
}
