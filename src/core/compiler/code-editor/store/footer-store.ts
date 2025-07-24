import { create } from 'zustand'

export interface FooterState {
  isOpen: boolean
  activeTabId: string | null
  togglePanel: () => void
  setActiveTab: (tabId: string) => void
}

export const useFooterStore = create<FooterState>((set) => ({
  isOpen: false,
  activeTabId: null,
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
}))
