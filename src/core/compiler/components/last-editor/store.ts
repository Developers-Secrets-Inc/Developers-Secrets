import { create } from 'zustand'
import { compileCode } from '../..'

// Define the interface for the store's state and actions
interface IDEStore {
  language: string
  availableLanguages: string[]
  codeByLanguage: Record<string, string>
  isTerminalOpen: boolean
  activeTab: string
  theme: string
  output: string
  setLanguage: (language: string) => void
  setCode: (code: string) => void
  setCodeByLanguage: (lang: string, code: string) => void
  setIsTerminalOpen: (isTerminalOpen: boolean) => void
  setActiveTab: (activeTab: string) => void
  setTheme: (theme: string) => void
  setOutput: (output: string) => void
  initialize: (params: {
    availableLanguages?: string[]
    codeByLanguage?: Record<string, string>
    language?: string
  }) => void
  runCode: () => void
}

export const useIDEStore = create<IDEStore>((set, get) => ({
  language: 'javascript',
  availableLanguages: ['javascript', 'python'],
  codeByLanguage: { javascript: '', python: '' },
  isTerminalOpen: false,
  activeTab: 'code',
  theme: 'vs-dark',
  output: '',
  setLanguage: (language: string) => set({ language }),
  setCode: (code: string) => {
    const lang = get().language
    set((state) => ({
      codeByLanguage: { ...state.codeByLanguage, [lang]: code },
    }))
  },
  setCodeByLanguage: (lang, code) =>
    set((state) => ({
      codeByLanguage: { ...state.codeByLanguage, [lang]: code },
    })),
  setIsTerminalOpen: (isTerminalOpen: boolean) => set({ isTerminalOpen }),
  setActiveTab: (activeTab: string) => set({ activeTab }),
  setTheme: (theme: string) => set({ theme }),
  setOutput: (output: string) => set({ output }),
  initialize: ({ availableLanguages, codeByLanguage, language }) => {
    if (availableLanguages) set({ availableLanguages })
    if (codeByLanguage) set({ codeByLanguage })
    if (language) set({ language })
  },
  runCode: async () => {
    const { codeByLanguage, language } = get()
    const result = await compileCode(codeByLanguage[language] || '', language)
    set({ output: result.output ?? '' })
    set({ activeTab: 'output', isTerminalOpen: true })
  },
}))
