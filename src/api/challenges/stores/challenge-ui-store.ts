import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PearlViewMode = 'inline' | 'sheet'

interface ChallengeUIState {
  viewMode: PearlViewMode
  isChatActive: boolean
  isCompletionDialogOpen: boolean
  openCompletionDialog: () => void
  closeCompletionDialog: () => void
  setViewMode: (mode: PearlViewMode) => void
  showChat: () => void
  hideChat: () => void
}

export const useChallengeUIStore = create<ChallengeUIState>()(
  persist(
    (set) => ({
      viewMode: 'inline',
      isChatActive: false,
      isCompletionDialogOpen: false,
      setViewMode: (mode) => set({ viewMode: mode }),
      showChat: () => set({ isChatActive: true }),
      hideChat: () => set({ isChatActive: false }),
      openCompletionDialog: () => set({ isCompletionDialogOpen: true }),
      closeCompletionDialog: () => set({ isCompletionDialogOpen: false }),
    }),
    {
      name: 'challenge-ui-state', // The key in localStorage
      // Only persist the 'viewMode' field, ignoring 'isChatActive' and 'isCompletionDialogOpen'
      partialize: (state) => ({ viewMode: state.viewMode }),
    },
  ),
)
