import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Send } from 'lucide-react'
import { useSubmissionStore, type SubmissionCode } from '../submissions/store'
import { useIDEStore } from '@/core/compiler/components/last-editor/store'

export const SubmitButton = (): React.JSX.Element => {
  const { submit, isSubmitting } = useSubmissionStore()
  const { language, codeByLanguage } = useIDEStore()

  const handleSubmit = async (): Promise<void> => {
    if (!language) return
    
    const currentCode = codeByLanguage[language] || ''
    if (!currentCode) return
    
    const submission: SubmissionCode = {
      language,
      content: currentCode,
    }
    
    await submit(submission)
  }

  return (
    <Button 
      size="sm" 
      className="h-8"
      onClick={() => { void handleSubmit() }}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <Send size={14} className="mr-1" />
      )}
      <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
    </Button>
  )
}
