'use client'

import React from 'react'
import { useFooterStore } from '../store/footer-store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Beaker, FileOutput } from 'lucide-react'

// Assuming FooterTab is defined here or imported from a valid path
// For now, let's redefine it to match the new structure.
export interface FooterTab {
  id: string
  title: string
  content: React.ReactNode
  icon: string // Changed from ElementType to string
}

const iconMap: { [key: string]: React.ElementType } = {
  'file-output': FileOutput,
  beaker: Beaker,
}
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const TERMINAL_STYLE = {
  backgroundColor: '#1a1b26',
  color: '#ffffff',
  fontFamily: 'monospace',
  height: '100%',
  overflow: 'auto',
  whiteSpace: 'pre-wrap' as const,
}

interface FooterProps {
  tabs: FooterTab[]
}

export const Footer = ({ tabs }: FooterProps) => {
  const { isOpen, togglePanel, activeTabId, setActiveTab } = useFooterStore()

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  return (
    <div className="flex-shrink-0 flex flex-col border-t bg-background max-h-[40%]">
      <div
        className={cn('flex items-center justify-between px-1 h-10', isOpen ? 'border-b-0' : '')}
        onDoubleClick={togglePanel}
      >
        <Tabs value={activeTabId ?? undefined} onValueChange={setActiveTab} className="h-full">
          <TabsList className="flex-grow bg-transparent tabs-list-container">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <TabsTrigger value={tab.id} className="flex items-center gap-1.5">
                  {React.createElement(iconMap[tab.icon] || 'div', { size: 14 })}
                  <span>{tab.title}</span>
                </TabsTrigger>
                {index < tabs.length - 1 && (
                  <Separator orientation="vertical" className="h-3 mx-1" />
                )}
              </React.Fragment>
            ))}
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className='size-7' onClick={togglePanel}>
          {isOpen ? <ChevronDown className='h-4 w-4' /> : <ChevronUp className='h-4 w-4' />}
        </Button>
      </div>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          isOpen ? 'h-[300px] opacity-100' : 'h-0 opacity-0',
        )}
      >
        {activeTab && (
          <Tabs value={activeTabId ?? undefined} className='h-full'>
            <TabsContent value={activeTabId ?? ''} style={TERMINAL_STYLE} className='h-full p-0'>
              {activeTab.content}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
