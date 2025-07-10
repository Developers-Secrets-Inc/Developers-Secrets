import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChallengeStreakUpdateInfo } from '@/core/gamification/streaks/challenges'

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

// This type will now be populated by the server's response.
export type E2BTestResult = {
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
  testResults: E2BTestResult[]
  setTestResults: (results: E2BTestResult[]) => void
  initialize: (codeVersions: CodeVersion[]) => void
  isLoadingRun: boolean // This can be repurposed for the overall 'run' flow
  isLoadingSubmit: boolean // This will be used for the server-side execution part
  isPrechecking: boolean // New state for client-side pre-check
  precheckError: string | null // New state for pre-check errors
  setIsLoadingRun: (isLoading: boolean) => void
  setIsLoadingSubmit: (isLoading: boolean) => void
  setIsPrechecking: (isChecking: boolean) => void
  setPrecheckError: (error: string | null) => void
  showCompletionDialog: boolean
  openCompletionDialog: () => void
  closeCompletionDialog: () => void
  streakUpdateInfo: ChallengeStreakUpdateInfo | null
  setStreakUpdateInfo: (info: ChallengeStreakUpdateInfo | null) => void
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
      isPrechecking: false,
      precheckError: null,
      showCompletionDialog: false,
      streakUpdateInfo: null,

      // Simple setters
      setIsLoadingRun: (isLoading) => set({ isLoadingRun: isLoading }),
      setIsLoadingSubmit: (isLoading) => set({ isLoadingSubmit: isLoading }),
      setIsPrechecking: (isChecking) => set({ isPrechecking: isChecking }),
      setPrecheckError: (error) => set({ precheckError: error }),
      setStreakUpdateInfo: (info) => set({ streakUpdateInfo: info }),
      setExecutionOutput: (output) => set({ executionOutput: output }),
      setTestResults: (results) => set({ testResults: results }),

      // UI-related actions
      openCompletionDialog: () => set({ showCompletionDialog: true }),
      closeCompletionDialog: () => {
        set({ showCompletionDialog: false, streakUpdateInfo: null })
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

      // Initialization logic
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
