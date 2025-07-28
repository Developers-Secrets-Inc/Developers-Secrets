'use client'

import { create } from 'zustand'

// Types pour les résultats de tests individuels
export interface TestResult {
  success: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  error?: string
}

// Types pour les résultats de soumission (alignés avec les types existants)
export type SubmissionType = 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'

export interface SubmissionResult {
  type: SubmissionType
  testsPassed: number
  testsTotal: number
  error?: string
  input?: string
  output?: string
  expectedOutput?: string
  lastExpectedOutput?: Array<{ output: string }>
}

// Interface du store pour gérer les résultats de soumission
interface SubmissionResultsStore {
  // État
  submissionResult: SubmissionResult | null
  testResults: TestResult[] | null
  isSubmitting: boolean
  
  // Actions
  setSubmissionResult: (result: SubmissionResult) => void
  setTestResults: (results: TestResult[]) => void
  setIsSubmitting: (loading: boolean) => void
  clearResults: () => void
  reset: () => void
  
  // Actions combinées pour faciliter l'usage
  setResults: (submission: SubmissionResult, tests: TestResult[]) => void
}

// Store Zustand pour gérer les résultats de soumission
export const useSubmissionResultsStore = create<SubmissionResultsStore>((set) => ({
  // État initial
  submissionResult: null,
  testResults: null,
  isSubmitting: false,
  
  // Actions individuelles
  setSubmissionResult: (result) => set({ submissionResult: result }),
  setTestResults: (results) => set({ testResults: results }),
  setIsSubmitting: (loading) => set({ isSubmitting: loading }),
  
  // Action pour nettoyer les résultats
  clearResults: () => set({ 
    submissionResult: null, 
    testResults: null, 
    isSubmitting: false 
  }),
  
  // Action de reset (alias pour clearResults pour cohérence avec autres stores)
  reset: () => set({ 
    submissionResult: null, 
    testResults: null, 
    isSubmitting: false 
  }),
  
  // Action combinée pour définir les deux résultats en une fois
  setResults: (submission, tests) => set({ 
    submissionResult: submission, 
    testResults: tests,
    isSubmitting: false
  }),
}))