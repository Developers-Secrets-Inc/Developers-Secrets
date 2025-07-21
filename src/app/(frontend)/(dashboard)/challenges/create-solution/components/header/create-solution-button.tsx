'use client' // Assurer que c'est un client component

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useSolutionFormStore } from '../../store/solution-form-store'
import { useSubmitSolution } from '../../hooks/use-submit-solution'

export const CreateSolutionButton = () => {
  const isNewSolution = useSolutionFormStore((state) => state.isNewSolution)

  const { mutate: handleSubmit, isPending } = useSubmitSolution()

  const buttonText = isNewSolution ? 'Create' : 'Update'
  const loadingText = isNewSolution ? 'Creating...' : 'Updating...'

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={() => handleSubmit()} disabled={isPending} size="sm">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? loadingText : buttonText}
      </Button>
    </div>
  )
}
