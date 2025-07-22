import { create } from 'zustand'
import type { ReactNode } from 'react'

export interface FooterTab {
  id: string
  title: string
  panel: ReactNode
}

interface FooterState {
  isOpen: boolean
  tabs: FooterTab[]
  activeTabId: string | null
  togglePanel: () => void
  setActiveTab: (tabId: string) => void
  addTab: (tab: FooterTab) => void
  removeTab: (tabId: string) => void
}

export const useFooterStore = create<FooterState>((set) => ({
  isOpen: true,
  tabs: [],
  activeTabId: null,
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  addTab: (tab) =>
    set((state) => {
      if (state.tabs.some((t) => t.id === tab.id)) {
        return state // Évite les doublons
      }
      const newTabs = [...state.tabs, tab]
      // Si c'est le premier onglet, on le rend actif
      const newActiveTabId = state.activeTabId === null ? tab.id : state.activeTabId
      return { tabs: newTabs, activeTabId: newActiveTabId }
    }),
  removeTab: (tabId) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== tabId)
      // Si l'onglet actif est celui qu'on supprime, on passe au premier onglet restant ou à null
      const newActiveTabId =
        state.activeTabId === tabId ? (newTabs[0]?.id ?? null) : state.activeTabId
      return { tabs: newTabs, activeTabId: newActiveTabId }
    }),
}))
