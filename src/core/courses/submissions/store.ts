import { create } from 'zustand'

// Types alignés sur CoursePartSubmissions
export type SubmissionType = 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'

export interface SubmissionCode {
  language: string
  content: string
}

export interface SubmissionResult {
  id?: string
  submissionType: SubmissionType
  part?: number | string
  authorId?: string
  testsPassed: number
  testsTotal: number
  code: SubmissionCode
  error?: string
  lastExpectedOutput?: string[]
  input?: string
  output?: string
  expectedOutput?: string
  createdAt?: string
}

// Détail d'un test individuel pour l'affichage dans le footer
export interface TestCaseResult {
  input: string
  expectedOutput: string
  output: string
  passed: boolean
  error?: string // Pour runtime error ou timeout
}

interface SubmissionStore {
  isSubmitting: boolean
  result: SubmissionResult | null
  error: string | null
  testResults: TestCaseResult[] | null
  submit: (code: SubmissionCode) => void
  reset: () => void
}

export const useSubmissionStore = create<SubmissionStore>((set) => ({
  isSubmitting: false,
  result: null,
  error: null,
  testResults: null,
  submit: (code) => {
    set({ isSubmitting: true, error: null, testResults: null, result: null })
    // Ici, on branchera la logique backend réelle (mutation, etc.)
    // Pour l'instant, on ne simule aucun résultat
    set({ isSubmitting: false })
  },
  reset: () => set({ isSubmitting: false, result: null, error: null, testResults: null }),
}))
