'use client'

import { Tabs as ShadcnTabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, FileOutput } from 'lucide-react'
import React from 'react'
import { useGenericCodeEditor } from './context'

const TERMINAL_STYLE = {
  backgroundColor: '#1a1b26',
  color: '#c0caf5', // Tokyo Night Light text color
  fontFamily: 'monospace',
  padding: '12px',
  height: '100%',
  overflow: 'auto',
  whiteSpace: 'pre-wrap' as const,
  fontSize: '13px',
  lineHeight: '1.5',
}

// Sub-component: Tabs Container (Manages active tab via context)
export const Tabs = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode
  defaultValue?: string
}) => {
  const { activeTab, setActiveTab } = useGenericCodeEditor()

  // Use defaultValue if provided, otherwise stick to context's activeTab
  const value = defaultValue && !activeTab ? defaultValue : activeTab

  return (
    <ShadcnTabs value={value} onValueChange={setActiveTab} className="h-full flex flex-col">
      {children}
    </ShadcnTabs>
  )
}

// Sub-component: Tab Trigger (remains simple)
export const TabTrigger = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return (
    <TabsTrigger
      value={value}
      className="flex items-center gap-1.5 text-xs px-2 py-1 h-auto data-[state=active]:bg-muted/80"
    >
      {children}
    </TabsTrigger>
  )
}

// Sub-component: Tab Content (Renders children provided by parent)
export const TabContent = ({ value, children }: { value: string; children?: React.ReactNode }) => {
  return (
    <TabsContent value={value} className="h-full p-0 m-0 flex-grow overflow-hidden">
      {/* Render children directly inside the styled div */}
      <div style={TERMINAL_STYLE} className="h-full">
        {children ?? '> No content provided for this tab.'}
      </div>
    </TabsContent>
  )
}

// Sub-component: Internal component for the tabs bar layout (renders children triggers)
const FooterTabsBar = ({ children }: { children: React.ReactNode }) => {
  const { isTerminalOpen, toggleTerminal } = useGenericCodeEditor()

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.tabs-list-container')) {
      toggleTerminal()
    }
  }

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleTerminal()
  }

  return (
    <div
      className={cn(
        'border-t flex items-center justify-between px-1 h-10 bg-muted/20 flex-shrink-0',
        isTerminalOpen ? 'border-b-0' : '',
      )}
      onDoubleClick={handleDoubleClick}
    >
      {/* Render triggers passed as children */}
      <TabsList className="bg-transparent tabs-list-container">{children}</TabsList>
      {/* Chevron Toggle */}
      <div
        className="flex items-center cursor-pointer p-1 hover:bg-muted rounded-sm mr-2"
        onClick={handleChevronClick}
        title={isTerminalOpen ? 'Close terminal' : 'Open terminal'}
      >
        {isTerminalOpen ? (
          <ChevronDown size={16} className="text-muted-foreground" />
        ) : (
          <ChevronUp size={16} className="text-muted-foreground" />
        )}
      </div>
    </div>
  )
}

// Main Footer component (Layout wrapper - delegates tab structure to children)
export const Footer = ({ children }: { children: React.ReactNode }) => {
  const { isTerminalOpen } = useGenericCodeEditor()

  // Separate children into Triggers and Content
  const triggers: React.ReactNode[] = []
  const contents: React.ReactNode[] = []
  let defaultTabValue: string | undefined = undefined

  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child)) {
      if (child.type === TabTrigger) {
        triggers.push(child)
        if (index === 0 && child.props && typeof (child.props as any).value === 'string') {
          defaultTabValue = (child.props as any).value
        }
      } else if (child.type === TabContent) {
        contents.push(child)
      }
    }
  })

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out overflow-hidden border-t flex-shrink-0 flex flex-col',
        isTerminalOpen ? 'h-[30%]' : 'h-10',
      )}
    >
      {/* Pass default value to Tabs if found */}
      <Tabs defaultValue={defaultTabValue}>
        <FooterTabsBar>{triggers}</FooterTabsBar>
        <div className="flex-grow overflow-hidden relative">{contents}</div>
      </Tabs>
    </div>
  )
}
