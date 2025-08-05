import { create } from 'zustand'

interface FileExplorerState {
  isOpen: boolean
  toggle: () => void
  reset: () => void
}

export const useFileExplorerStore = create<FileExplorerState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  reset: () => set({ isOpen: false }),
}))
