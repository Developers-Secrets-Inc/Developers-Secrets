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
  submit: () => Promise<void>
  run: () => void
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
      run: async () => {
        const {
          currentLanguage,
          codeByLanguage,
          setExecutionOutput,
          setActiveTerminalTab,
          toggleTerminal,
          setIsLoadingRun,
        } = get()
        const code = codeByLanguage[currentLanguage]

        setIsLoadingRun(true)
        setExecutionOutput(`Running ${currentLanguage} code...`)
        setActiveTerminalTab('output')
        if (!get().isTerminalOpen) {
          toggleTerminal()
        }

        try {
          const { success, output, error } = await compileCode(code, currentLanguage)
          if (success) {
            setExecutionOutput(output)
          } else {
            setExecutionOutput(`Error:\n${error}`)
          }
        } catch (err) {
          setExecutionOutput(
            `Compilation failed:\n${err instanceof Error ? err.message : String(err)}`,
          )
        } finally {
          setIsLoadingRun(false)
        }
      },
      submit: async () => {
        const {
          currentLanguage,
          codeByLanguage,
          setTestResults,
          setActiveTerminalTab,
          toggleTerminal,
          availableLanguages,
          setIsLoadingSubmit,
        } = get()

        setIsLoadingSubmit(true)
        const code = codeByLanguage[currentLanguage]
        setActiveTerminalTab('tests')
        if (!get().isTerminalOpen) {
          toggleTerminal()
        }

        const languageConfig = availableLanguages.find((lang) => lang.value === currentLanguage)
        if (!languageConfig) {
          setTestResults([
            {
              success: false,
              input: '',
              expectedOutput: '',
              actualOutput: 'Error: No test cases found for this language',
            },
          ])
          setIsLoadingSubmit(false)
          return
        }

        try {
          console.log(code)
          const submission = await submitCode(
            { content: code, language: currentLanguage },
            languageConfig.testCases.map((tc) => ({
              input: { content: tc.input, language: currentLanguage },
              expectedOutput: { content: tc.expectedOutput, language: currentLanguage },
            })),
          )

          console.log('submission', submission)

          console.log('config tests', languageConfig.testCases)
          const testResults = await Promise.all(
            languageConfig.testCases.map(async (tc, index) => {
              const testCode = `${code}\n${tc.input}`

              console.log('test code', testCode)

              const result = await compileCode(testCode, currentLanguage)

              console.log('Result', result)

              let cleanOutput = result.success ? result.output : result.error || 'No output'
              cleanOutput = cleanOutput.replace(new RegExp(`^${tc.input}[\n\r]*`), '').trim()

              return {
                success: index < submission.testsPassed,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: cleanOutput,
              }
            }),
          )

          setTestResults(testResults)
        } catch (error) {
          setTestResults([
            {
              success: false,
              input: '',
              expectedOutput: '',
              actualOutput: `Submission failed: ${error instanceof Error ? error.message : String(error)}`,
            },
          ])
        } finally {
          setIsLoadingSubmit(false)
        }
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
