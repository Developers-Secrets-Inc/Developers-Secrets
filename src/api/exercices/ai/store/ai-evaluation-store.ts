'use client'

import { create } from 'zustand'
import { z } from 'zod'
import { EvaluationSchema } from '../types'

// Type inféré depuis EvaluationSchema
type EvaluationResult = z.infer<typeof EvaluationSchema>

// Type pour une liste d'évaluations
export type AiEvaluation = EvaluationResult[]

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

// Interface du store pour gérer les résultats d'évaluation IA et de soumission
interface AiEvaluationStore {
  // État
  aiEvaluation: AiEvaluation | null
  submissionResult: SubmissionResult | null
  testResults: TestResult[] | null
  isCompiling: boolean
  isEvaluating: boolean
  isSubmitting: boolean
  
  // Actions
  setAiEvaluation: (results: AiEvaluation) => void
  setSubmissionResult: (result: SubmissionResult) => void
  setTestResults: (results: TestResult[]) => void
  setIsCompiling: (loading: boolean) => void
  setIsEvaluating: (loading: boolean) => void
  setIsSubmitting: (loading: boolean) => void
  clearResults: () => void
  reset: () => void
  
  // Actions combinées
  setAiAndSubmissionResults: (aiResults: AiEvaluation, submission: SubmissionResult, tests: TestResult[]) => void
  startCompilation: () => void
  startEvaluation: () => void
  completeEvaluation: () => void
}

// Store Zustand pour gérer les résultats d'évaluation IA et de soumission
export const useAiEvaluationStore = create<AiEvaluationStore>((set) => ({
  // État initial
  aiEvaluation: null,
  submissionResult: null,
  testResults: null,
  isCompiling: false,
  isEvaluating: false,
  isSubmitting: false,

  // Actions individuelles
  setAiEvaluation: (results) => set({ aiEvaluation: results }),
  setSubmissionResult: (result) => set({ submissionResult: result }),
  setTestResults: (results) => set({ testResults: results }),
  setIsCompiling: (loading) => set({ isCompiling: loading }),
  setIsEvaluating: (loading) => set({ isEvaluating: loading }),
  setIsSubmitting: (loading) => set({ isSubmitting: loading }),

  // Action pour nettoyer tous les résultats
  clearResults: () =>
    set({
      aiEvaluation: null,
      submissionResult: null,
      testResults: null,
      isCompiling: false,
      isEvaluating: false,
      isSubmitting: false,
    }),

  // Action de reset (alias pour clearResults)
  reset: () =>
    set({
      aiEvaluation: null,
      submissionResult: null,
      testResults: null,
      isCompiling: false,
      isEvaluating: false,
      isSubmitting: false,
    }),

  // Action combinée pour définir les résultats IA et de soumission
  setAiAndSubmissionResults: (aiResults, submission, tests) =>
    set({
      aiEvaluation: aiResults,
      submissionResult: submission,
      testResults: tests,
      isCompiling: false,
      isEvaluating: false,
      isSubmitting: false,
    }),

  // Actions pour le flux en deux étapes
  startCompilation: () =>
    set({
      isCompiling: true,
      isEvaluating: false,
      isSubmitting: true,
    }),

  startEvaluation: () =>
    set({
      isCompiling: false,
      isEvaluating: true,
      isSubmitting: true,
    }),

  completeEvaluation: () =>
    set({
      isCompiling: false,
      isEvaluating: false,
      isSubmitting: false,
    }),
}))