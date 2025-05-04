'use client'

import { Option } from '@/components/ui/multiselect' // Assure-toi que le chemin est correct
import { UserSolution, Challenge } from '@/payload-types' // Adapter les imports si nécessaire
import { create, StoreApi, UseBoundStore } from 'zustand'
import { StateCreator } from 'zustand'

// 1. Définir l'interface pour l'état du store
export interface SolutionFormState {
  title: string
  description: string
  tags: Option[]
  status: 'drafted' | 'published'
  isInitialized: boolean // Pour éviter les réinitialisations multiples
  isNewSolution: boolean
  solutionId: string | null
  challengeId: number | null
  challengeSlug: string | null
  challengeTitle: string | null
  userId: string | null
  initialRawContent: string | null // Contenu brut initial de l'éditeur
  getEditorContent: (() => Promise<string>) | null

  // --- Actions pour modifier l'état ---
  initialize: (initialData: {
    initialSolution:
      | (Omit<UserSolution, 'tags' | 'content'> & { tags: Option[]; content?: string })
      | null // Adapter si besoin
    challenge: Challenge
    userId: string
  }) => void
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setTags: (tags: Option[]) => void
  _setStatusInternal: (status: 'drafted' | 'published') => void // Action interne utilisée par RQ ou init
  setEditorContentGetter: (getter: () => Promise<string>) => void
  reset: () => void
}

// 2. Définir l'état initial
const initialState = {
  title: '',
  description: '',
  tags: [],
  status: 'drafted' as 'drafted' | 'published', // Toujours 'drafted' au début
  isInitialized: false,
  isNewSolution: true,
  solutionId: null,
  challengeId: null,
  challengeSlug: null,
  challengeTitle: null,
  userId: null,
  initialRawContent: null, // Initialiser à null
  getEditorContent: null,
}

// 3. Créer le store avec create ET types explicites pour set/get
export const useSolutionFormStore = create<SolutionFormState>(
  (set: StoreApi<SolutionFormState>['setState'], get: StoreApi<SolutionFormState>['getState']) => ({
    ...initialState,

    // Action pour initialiser le store avec les données serveur
    initialize: ({ initialSolution, challenge, userId }) => {
      // Empêche la réinitialisation si déjà fait
      if (get().isInitialized) return

      const isNew = !initialSolution?.id
      set({
        title: initialSolution?.title || '',
        description: initialSolution?.description || '',
        tags: initialSolution?.tags || [],
        status: isNew
          ? 'drafted'
          : (initialSolution?.status as 'drafted' | 'published') || 'drafted',
        isInitialized: true,
        isNewSolution: isNew,
        solutionId: initialSolution?.id?.toString() || null,
        challengeId: challenge.id,
        challengeSlug: challenge.slug,
        challengeTitle: challenge.title,
        userId: userId,
        initialRawContent: initialSolution?.content || null, // Stocker le contenu brut
      })
    },

    // Actions simples pour mettre à jour chaque champ
    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setTags: (tags) => set({ tags }),

    // Action interne pour que la logique de mutation RQ puisse forcer un statut
    // (par exemple, après une mise à jour réussie via le dropdown)
    // Le dropdown lui-même n'appellera PAS cette fonction directement.
    _setStatusInternal: (status) => set({ status }),

    setEditorContentGetter: (getter) => set({ getEditorContent: getter }),

    // Action pour réinitialiser le formulaire (utile après création réussie)
    reset: () => set({ ...initialState, getEditorContent: get().getEditorContent }),
  }),
)

// 4. (Optionnel mais recommandé) Hook d'initialisation
// Ce composant client sera utilisé dans la page serveur pour initialiser le store une seule fois.
import { useEffect, useRef } from 'react'

interface SolutionFormStoreInitializerProps {
  initialSolution:
    | (Omit<UserSolution, 'tags' | 'content'> & { tags: Option[]; content?: string })
    | null
  challenge: Challenge
  userId: string
}

export function SolutionFormStoreInitializer({
  initialSolution,
  challenge,
  userId,
}: SolutionFormStoreInitializerProps) {
  const initialized = useRef(false)
  const initialize = useSolutionFormStore((state) => state.initialize)

  useEffect(() => {
    if (!initialized.current) {
      // On passe l'objet complet, y compris `content` s'il existe
      initialize({ initialSolution, challenge, userId })
      initialized.current = true
    }
  }, [initialize, initialSolution, challenge, userId])

  return null // Ce composant ne rend rien
}
