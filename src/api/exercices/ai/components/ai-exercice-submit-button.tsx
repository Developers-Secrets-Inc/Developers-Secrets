'use client'

import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useAIChallengeSubmission } from '../../hooks/use-ai-challenge-submission'
import { LoadingIcon } from '@/components/common/loading-icon'


export const SubmitButton = () => {
  const { isLoading, submit } = useAIChallengeSubmission()

  return (
    <Button variant="default" size="sm" className="h-8" onClick={() => submit()}>
      <LoadingIcon isLoading={isLoading}>
        <Send size={14} className="mr-1" />
      </LoadingIcon>
      Submit
    </Button>
  )
}
