import { create } from 'zustand'

type EvaluationResult = {
  score: number
  improvements: string[]
  strengths: string[]
  suggestions: string[]
  category: 'excellent' | 'good' | 'average' | 'needs_improvement' | 'poor'
}

type EvaluationState = {
  evaluation: EvaluationResult | null
  isLoading: boolean
  error: string | null
}

type EvaluationActions = {
  setEvaluation: (evaluation: EvaluationResult) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearEvaluation: () => void
}

type EvaluationStore = EvaluationState & EvaluationActions

export const useEvaluationStore = create<EvaluationStore>((set) => ({
  evaluation: null,
  isLoading: false,
  error: null,

  // Actions
  setEvaluation: (evaluation) => set({ evaluation, error: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  clearEvaluation: () => set({ 
    evaluation: null, 
    error: null, 
    isLoading: false 
  })
}))