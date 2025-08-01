import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PearlViewMode = 'inline' | 'sheet'

interface PearlViewState {
  viewMode: PearlViewMode
  isChatActive: boolean
  setViewMode: (mode: PearlViewMode) => void
  showChat: () => void
  hideChat: () => void
  reset: () => void
}

export const usePearlViewStore = create<PearlViewState>()(
  persist(
    (set) => ({
      viewMode: 'inline',
      isChatActive: false,
      setViewMode: (mode) => set({ viewMode: mode }),
      showChat: () => set({ isChatActive: true }),
      hideChat: () => set({ isChatActive: false }),
      // Selective reset: only reset non-persisted values
      reset: () => set((state) => ({
        ...state,
        isChatActive: false
        // viewMode is preserved as it's persisted in localStorage
      })),
    }),
    {
      name: 'challenge-ui-state', // The key in localStorage
      // Only persist the 'viewMode' field, ignoring 'isChatActive'
      partialize: (state) => ({ viewMode: state.viewMode }),
    },
  ),
)
