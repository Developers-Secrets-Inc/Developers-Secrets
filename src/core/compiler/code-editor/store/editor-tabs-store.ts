import { create } from 'zustand'

// Defines a tab in the editor
export interface EditorTab {
  id: string
  fileId: string
  fileName: string
  language: string
}

// Defines the state of the editor tabs store
interface EditorTabsState {
  openTabs: EditorTab[]
  activeTabId: string | null
}

// Defines the actions available on the editor tabs store
interface EditorTabsActions {
  openTab: (fileId: string, fileName: string, language: string) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  replaceActiveTab: (fileId: string, fileName: string, language: string) => void
  closeAllTabs: () => void
  reset: () => void
}

// Zustand store for managing the editor tabs state
export const useEditorTabsStore = create<EditorTabsState & EditorTabsActions>((set, get) => ({
  openTabs: [],
  activeTabId: null,
  
  openTab: (fileId, fileName, language) => {
    const { openTabs } = get()
    
    // Check if tab already exists
    const existingTab = openTabs.find(tab => tab.fileId === fileId)
    if (existingTab) {
      set({ activeTabId: existingTab.id })
      return
    }
    
    // Create new tab
    const newTab: EditorTab = {
      id: crypto.randomUUID(),
      fileId,
      fileName,
      language
    }
    
    set({
      openTabs: [...openTabs, newTab],
      activeTabId: newTab.id
    })
  },
  
  closeTab: (tabId) => {
    const { openTabs, activeTabId } = get()
    const updatedTabs = openTabs.filter(tab => tab.id !== tabId)
    
    let newActiveTabId = activeTabId
    
    // If closing the active tab, set new active tab
    if (activeTabId === tabId) {
      if (updatedTabs.length > 0) {
        const closedTabIndex = openTabs.findIndex(tab => tab.id === tabId)
        const newIndex = Math.min(closedTabIndex, updatedTabs.length - 1)
        newActiveTabId = updatedTabs[newIndex]?.id || null
      } else {
        newActiveTabId = null
      }
    }
    
    set({
      openTabs: updatedTabs,
      activeTabId: newActiveTabId
    })
  },
  
  setActiveTab: (tabId) => {
    const { openTabs } = get()
    const tabExists = openTabs.some(tab => tab.id === tabId)
    
    if (tabExists) {
      set({ activeTabId: tabId })
    }
  },
  
  replaceActiveTab: (fileId, fileName, language) => {
    const { activeTabId, openTabs } = get()
    
    if (!activeTabId) {
      // No active tab, just open new tab
      get().openTab(fileId, fileName, language)
      return
    }
    
    // Check if file is already open in another tab
    const existingTab = openTabs.find(tab => tab.fileId === fileId)
    if (existingTab) {
      set({ activeTabId: existingTab.id })
      return
    }
    
    // Replace active tab
    const updatedTabs = openTabs.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, fileId, fileName, language }
        : tab
    )
    
    set({ openTabs: updatedTabs })
  },
  
  closeAllTabs: () => {
    set({ openTabs: [], activeTabId: null })
  }
}))