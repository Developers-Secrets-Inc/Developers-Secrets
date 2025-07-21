'use client' // Assurer que c'est un client component

import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipProvider } from '@radix-ui/react-tooltip'
import { CircleDot } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateSolutionStatus } from '@/core/challenges/users-solutions/actions'
import { SolutionFormState, useSolutionFormStore } from '../../store/solution-form-store'

type SolutionStatus = 'drafted' | 'published'

export const SolutionDraftStatus = () => {
  const status = useSolutionFormStore((state: SolutionFormState) => state.status)
  const solutionId = useSolutionFormStore((state: SolutionFormState) => state.solutionId)
  const isNewSolution = useSolutionFormStore((state: SolutionFormState) => state.isNewSolution)
  const _setStatusInternal = useSolutionFormStore(
    (state: SolutionFormState) => state._setStatusInternal,
  )
  const queryClient = useQueryClient()

  const { mutate: handleStatusChange, isPending } = useMutation({
    mutationFn: async (newStatus: SolutionStatus) => {
      if (!solutionId) {
        // Ne devrait pas arriver car le bouton est désactivé si new
        throw new Error('Cannot update status for a new solution.')
      }
      await updateSolutionStatus(solutionId, newStatus) // Action serveur
    },
    onMutate: async (newStatus) => {
      const queryKey = ['userSolution', solutionId]
      await queryClient.cancelQueries({ queryKey })
      const previousStatus = status
      _setStatusInternal(newStatus) // Met à jour le store Zustand de manière optimiste

      // Snapshot/Update cache RQ (optionnel, mais bonne pratique)
      const previousSolutionData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: any) =>
        old ? { ...old, status: newStatus } : undefined,
      )

      return { previousStatus, previousSolutionData }
    },
    onError: (err, newStatus, context) => {
      const queryKey = ['userSolution', solutionId]
      if (context?.previousStatus) {
        _setStatusInternal(context.previousStatus)
      }
      if (context?.previousSolutionData) {
        queryClient.setQueryData(queryKey, context.previousSolutionData) // Rollback cache RQ
      }
      toast.error('Failed to update status.')
      console.error('Error updating status:', err)
    },
    onSettled: () => {
      const queryKey = ['userSolution', solutionId]
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const isDisabled = isNewSolution || isPending

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isDisabled}>
            <Button variant="outline" size="icon" aria-label="Change solution status">
              <CircleDot
                className={`w-3.5 h-3.5 ${
                  status === 'published' ? 'text-green-500' : 'text-yellow-500'
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
          {!isDisabled && (
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={(value) => handleStatusChange(value as SolutionStatus)}
              >
                <DropdownMenuRadioItem value="drafted">
                  <CircleDot className="w-3.5 h-3.5 mr-2 text-yellow-500" />
                  Drafted
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="published">
                  <CircleDot className="w-3.5 h-3.5 mr-2 text-green-500" />
                  Published
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        <TooltipContentCustom side="bottom">
          {isNewSolution ? (
            <p>Status can only be changed after the solution is created.</p>
          ) : (
            <p>{status === 'published' ? 'Status: Published' : 'Status: Drafted'}</p>
          )}
        </TooltipContentCustom>
      </Tooltip>
    </TooltipProvider>
  )
}
