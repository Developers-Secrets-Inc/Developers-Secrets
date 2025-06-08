import { create } from 'zustand'

interface EditorState {
  codeByLanguage: Record<string, string>
  currentLanguage: string
  setCodeByLanguage: (language: string, code: string) => void
  setCurrentLanguage: (language: string) => void
  initializeEditor: (initialCode: string, initialLanguage: string, codeVersions: Record<string, string>) => void
  isTerminalOpen: boolean
  setIsTerminalOpen: (isOpen: boolean) => void
  toggleTerminalOpen: () => void
  activeTab: TerminalTab
  setActiveTab: (tab: TerminalTab) => void
}

export type TerminalTab = 'tests' | 'output'

export const useEditorStore = create<EditorState>((set) => ({
  codeByLanguage: {},
  currentLanguage: 'javascript', // Default language, adjust if needed
  isTerminalOpen: true, // Default to open
  setIsTerminalOpen: (isOpen: boolean) => set({ isTerminalOpen: isOpen }),
  toggleTerminalOpen: () =>
    set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),
  activeTab: 'tests',
  setActiveTab: (tab: TerminalTab) => set({ activeTab: tab }),
  setCodeByLanguage: (language, code) =>
    set((state) => ({
      codeByLanguage: {
        ...state.codeByLanguage,
        [language]: code,
      },
    })),
  setCurrentLanguage: (language) => set({ currentLanguage: language }),
  initializeEditor: (initialCode, initialLanguage, codeVersions) =>
    set(() => {
      const initialState = { ...codeVersions }
      if (!initialState[initialLanguage]) {
        initialState[initialLanguage] = initialCode
      }
      return {
        codeByLanguage: initialState,
        currentLanguage: initialLanguage,
      }
    }),
}))