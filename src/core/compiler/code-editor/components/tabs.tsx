'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEditorTabsStore, EditorTab } from '../store/editor-tabs-store'
import { useEditorStore } from '../store/editor-store'

interface EditorTabsProps {
  className?: string
}

interface TabItemProps {
  tab: EditorTab
  isActive: boolean
  onSelect: (tabId: string) => void
  onClose: (tabId: string) => void
}

const TabItem = ({ tab, isActive, onSelect, onClose }: TabItemProps) => {
  const handleClick = () => {
    onSelect(tab.id)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose(tab.id)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 h-full text-sm border-r border-border cursor-pointer hover:bg-muted/50 transition-colors',
        'min-w-[120px] max-w-[200px] flex-shrink-0',
        isActive && 'bg-background border-b-2 border-b-primary'
      )}
      onClick={handleClick}
    >
      <span className="truncate flex-1">
        {tab.fileName}
      </span>
      <button
        className="flex-shrink-0 p-0.5 hover:bg-muted rounded opacity-60 hover:opacity-100 transition-opacity"
        onClick={handleClose}
        aria-label={`Close ${tab.fileName}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

export const EditorTabs = ({ className }: EditorTabsProps) => {
  const { openTabs, activeTabId, setActiveTab, closeTab } = useEditorTabsStore()
  const { setActiveFileId } = useEditorStore()

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId)
    
    // Trouver l'onglet sélectionné et synchroniser avec l'éditeur
    const selectedTab = openTabs.find(tab => tab.id === tabId)
    if (selectedTab) {
      setActiveFileId(selectedTab.fileId)
    }
  }

  if (openTabs.length === 0) {
    return null
  }

  return (
    <div className={cn('flex h-12 bg-muted/30 border-b border-border overflow-x-auto max-w-full', className)}>
      <div className="flex min-w-0">
        {openTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSelect={handleTabSelect}
            onClose={closeTab}
          />
        ))}
      </div>
    </div>
  )
}

export default EditorTabs