import { Award, FileTextIcon, ListChecks, LucideIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import React, { Children } from 'react'
import { Tab as TabType } from '../../tabs-config'

export const NavigationTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav className="h-12 flex-none border-b bg-background">
      <div className="flex h-full">{Children.map(children, (child) => child)}</div>
    </nav>
  )
}

type TabProps = {
  label: string
  icon: LucideIcon
  href: string
  active?: boolean
}

export function Tab({ label, icon: Icon, href, active }: TabProps) {
  return (
    <Link
      href={href}
      className={[
        'flex items-center justify-center gap-1.5 w-full h-full px-4 transition-colors',
        'border-r border-border min-w-0 min-h-0 text-sm font-medium',
        'text-muted-foreground hover:bg-accent',
        active
          ? 'bg-muted after:bg-primary after:absolute after:pointer-events-none after:inset-x-0 after:bottom-0 after:h-0.5 border-b-primary/80 border-b-2'
          : '',
      ].join(' ')}
    >
      <Icon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
      <span className="leading-none">{label}</span>
    </Link>
  )
}

type TabsProps = {
  tabs: TabType[]
  activeTabId: string
}

export function Tabs({ tabs }: TabsProps) {
  return (
    <NavigationTabs>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          label={tab.label}
          icon={tab.icon}
          href={tab.href}
          active={tab.active}
        />
      ))}
    </NavigationTabs>
  )
}
