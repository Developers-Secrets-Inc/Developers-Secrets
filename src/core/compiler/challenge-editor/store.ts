import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { compileCode } from '../index'
import { submitCode } from '@/core/challenges/submissions/index.client'

// Define supported languages
export const SUPPORTED_LANGUAGES = ['python', 'javascript', 'typescript'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

type ProgrammingLanguage = {
  value: SupportedLanguage
  label: string
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
}

type TestResult = {
  success: boolean
  input: string
  expectedOutput: string
  actualOutput: string
}

export type TerminalTab = 'output' | 'tests'

type CodeVersion = {
  language: string
  initialCode: string
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
}

interface ChallengeEditorStore {
  availableLanguages: ProgrammingLanguage[]
  changeLanguage: (language: SupportedLanguage) => void
  currentLanguage: SupportedLanguage
  codeByLanguage: Record<SupportedLanguage, string>
  setCode: (language: SupportedLanguage, code: string) => void
  isTerminalOpen: boolean
  toggleTerminal: () => void
  activeTerminalTab: TerminalTab
  setActiveTerminalTab: (tab: TerminalTab) => void
  executionOutput: string
  setExecutionOutput: (output: string) => void
  testResults: TestResult[]
  setTestResults: (results: TestResult[]) => void
  initialize: (codeVersions: CodeVersion[]) => void
  isLoadingRun: boolean
  isLoadingSubmit: boolean
  setIsLoadingRun: (isLoading: boolean) => void
  setIsLoadingSubmit: (isLoading: boolean) => void
  showCompletionDialog: boolean
  openCompletionDialog: () => void
  closeCompletionDialog: () => void
}

export const useChallengeEditorStore = create<ChallengeEditorStore>()(
  persist(
    (set, get) => ({
      availableLanguages: [] as ProgrammingLanguage[],
      currentLanguage: 'javascript' as SupportedLanguage,
      codeByLanguage: {} as Record<SupportedLanguage, string>,
      isTerminalOpen: true,
      activeTerminalTab: 'output',
      executionOutput: '',
      testResults: [],
      isLoadingRun: false,
      isLoadingSubmit: false,
      setIsLoadingRun: (isLoading) => set({ isLoadingRun: isLoading }),
      setIsLoadingSubmit: (isLoading) => set({ isLoadingSubmit: isLoading }),
      showCompletionDialog: false,
      openCompletionDialog: () => set({ showCompletionDialog: true }),
      closeCompletionDialog: () => set({ showCompletionDialog: false }),
      initialize: (codeVersions: CodeVersion[]) => {
        if (!codeVersions || codeVersions.length === 0) return

        const codeByLanguage: Record<SupportedLanguage, string> = {} as Record<
          SupportedLanguage,
          string
        >
        const availableLanguages = codeVersions.map((v) => ({
          value: v.language as SupportedLanguage,
          label: v.language.charAt(0).toUpperCase() + v.language.slice(1),
          testCases: v.testCases,
        }))

        codeVersions.forEach((version) => {
          codeByLanguage[version.language as SupportedLanguage] = version.initialCode
        })

        set({
          codeByLanguage,
          testResults: [],
          availableLanguages,
          currentLanguage: codeVersions[0].language as SupportedLanguage,
        })
      },
      changeLanguage: (language) => {
        set({ currentLanguage: language })
      },
      setCode: (language, code) => {
        set((state) => ({
          codeByLanguage: {
            ...state.codeByLanguage,
            [language]: code,
          },
        }))
      },
      toggleTerminal: () => set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),
      setActiveTerminalTab: (tab) => set({ activeTerminalTab: tab }),
      setExecutionOutput: (output) => set({ executionOutput: output }),
      setTestResults: (results) => set({ testResults: results }),
    }),
    {
      name: 'challenge-editor-store',
      partialize: (state) => ({
        codeByLanguage: state.codeByLanguage,
        currentLanguage: state.currentLanguage,
      }),
    },
  ),
)
