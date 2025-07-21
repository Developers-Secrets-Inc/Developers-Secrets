import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSolutionFormStore } from '../store/solution-form-store'
import { submitUserSolution } from '@/core/challenges/users-solutions/actions'

export const useSubmitSolution = () => {
  const router = useRouter()

  // --- Select state slices individually to prevent infinite loops ---
  const challengeId = useSolutionFormStore((state) => state.challengeId)
  const challengeSlug = useSolutionFormStore((state) => state.challengeSlug)
  const userId = useSolutionFormStore((state) => state.userId)
  const solutionId = useSolutionFormStore((state) => state.solutionId)
  const title = useSolutionFormStore((state) => state.title)
  const description = useSolutionFormStore((state) => state.description)
  const tags = useSolutionFormStore((state) => state.tags)
  const getEditorContent = useSolutionFormStore((state) => state.getEditorContent)
  // We might still need isNewSolution if the store's reset logic depends on it,
  // but it's not directly used in the mutationFn parameters.
  // const isNewSolution = useSolutionFormStore((state) => state.isNewSolution)
  // -----------------------------------------------------------------

  const mutation = useMutation({
    mutationFn: async () => {
      // Validate required state first
      if (!challengeId || !userId) {
        throw new Error('Missing challengeId or userId from store')
      }
      if (!challengeSlug) {
        throw new Error('Missing challengeSlug from store for redirect')
      }
      if (!getEditorContent) {
        // This case should ideally not happen if CreateSolutionForm sets it correctly
        toast.error('Editor is not ready. Please wait a moment and try again.', { duration: 5000 })
        throw new Error('Editor content function not available in store')
      }

      // Get content only when mutation runs
      const content = await getEditorContent()

      // Basic content validation
      if (!content || content.trim().length === 0) {
        toast.error('Solution content cannot be empty.')
        throw new Error('Solution content cannot be empty.')
      }

      // --- Log the data being sent ---
      console.log('Submitting solution with data:', {
        challengeId,
        userId,
        existingSolutionId: solutionId ?? undefined,
        contentTrimmed: content.trim().substring(0, 100) + '...', // Log snippet
        metadata: {
          title: title.trim() || 'Untitled Solution',
          description: description.trim() || 'No description provided',
          tags, // Log the actual tags array being sent
        },
        status: 'drafted',
      })
      // --------------------------------

      const result = await submitUserSolution({
        challengeId,
        userId,
        existingSolutionId: solutionId ?? undefined, // Handle null -> undefined
        content: content.trim(),
        metadata: {
          title: title.trim() || 'Untitled Solution', // Use selected title
          description: description.trim() || 'No description provided', // Use selected description
          tags, // Pass selected tags (Option[])
        },
        status: 'drafted', // Default status
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit solution')
      }
      return result // Return SolutionResponse { success: true, message: '...' }
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Solution submitted successfully!')

      // Redirect using the selected challengeSlug
      router.push(`/challenges/${challengeSlug}/solutions`)

      if (data.resetForm) {
        // Consider adding a reset action if needed for clearing form after successful *creation*
        // useSolutionFormStore.getState().reset()
      }
    },
    onError: (error) => {
      // Handles errors from validation checks or submitUserSolution
      // We already show toasts for specific errors in mutationFn, so this catches general/unexpected ones.
      if (!error.message.includes('Editor content cannot be empty')) {
        // Avoid duplicate toast for empty content
        toast.error(`Submission failed: ${error.message}`)
      }
      console.error('useSubmitSolution Error:', error) // Log for debugging
    },
  })

  return mutation
}
