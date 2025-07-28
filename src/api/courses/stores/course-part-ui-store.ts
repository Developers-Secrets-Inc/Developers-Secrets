import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PearlViewMode = 'inline' | 'sheet'

interface CoursePartUIState {
  viewMode: PearlViewMode
  isChatActive: boolean
  setViewMode: (mode: PearlViewMode) => void
  showChat: () => void
  hideChat: () => void
}

export const useCoursePartUIStore = create<CoursePartUIState>()(
  persist(
    (set) => ({
      viewMode: 'inline',
      isChatActive: false,
      setViewMode: (mode) => set({ viewMode: mode }),
      showChat: () => set({ isChatActive: true }),
      hideChat: () => set({ isChatActive: false }),
    }),
    {
      name: 'challenge-ui-state', // The key in localStorage
      // Only persist the 'viewMode' field, ignoring 'isChatActive' and 'isCompletionDialogOpen'
      partialize: (state) => ({ viewMode: state.viewMode }),
    },
  ),
)
