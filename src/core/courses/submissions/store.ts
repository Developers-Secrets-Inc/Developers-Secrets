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
  currentPartId: string | null
  setCurrentPart: (partId: string) => void
  submit: (code: SubmissionCode) => void
  reset: () => void
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  isSubmitting: false,
  result: null,
  error: null,
  testResults: null,
  currentPartId: null,
  setCurrentPart: (partId: string) => set({ currentPartId: partId }),
  submit: async (code) => {
    set({ isSubmitting: true, error: null, testResults: null, result: null })
    
    try {
      const { currentPartId } = get()
      if (!currentPartId) {
        throw new Error('No part selected')
      }

      // Simuler une réponse de test pour le moment
      // À remplacer par un appel API réel plus tard
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Exemple de réponse simulée
      const mockTestResults: TestCaseResult[] = [
        {
          input: 'test input',
          expectedOutput: 'expected output',
          output: 'actual output',
          passed: true,
        },
      ]
      
      const mockResult: SubmissionResult = {
        submissionType: 'accepted',
        testsPassed: 1,
        testsTotal: 1,
        code,
      }
      
      set({
        isSubmitting: false,
        result: mockResult,
        testResults: mockTestResults,
      })
    } catch (err) {
      set({
        isSubmitting: false,
        error: err instanceof Error ? err.message : 'Une erreur est survenue',
      })
    }
  },
  reset: () => set({ isSubmitting: false, result: null, error: null, testResults: null }),
}))
