import { create } from 'zustand'

export interface FooterState {
  isOpen: boolean
  activeTabId: string | null
  executionOutput: string | null
  togglePanel: () => void
  openPanel: () => void
  setActiveTab: (tabId: string) => void
  setExecutionOutput: (output: string) => void
  openOutputTab: () => void
}

export const useFooterStore = create<FooterState>((set) => ({
  isOpen: false,
  activeTabId: null,
  executionOutput: null,
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  openPanel: () => set((state) => ({ isOpen: true })),
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  setExecutionOutput: (output) => set({ executionOutput: output }),
  openOutputTab: () => set({ activeTabId: 'output', isOpen: true }),
}))
