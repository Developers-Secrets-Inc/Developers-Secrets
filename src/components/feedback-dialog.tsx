'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitFeedback } from '@/actions/feedback'
import { AlertCircle, CheckCircle, MessageSquare, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const params = useParams<{ tutorial_slug?: string; article_slug?: string }>()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setResult(null)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      setResult({
        success: false,
        message: 'Please enter a message',
      })
      return
    }

    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData()
    formData.append('message', message)

    if (params.tutorial_slug) {
      formData.append('tutorialSlug', params.tutorial_slug as string)
    }

    if (params.article_slug) {
      formData.append('articleSlug', params.article_slug as string)
    }

    try {
      const response = await submitFeedback(formData)
      setResult(response)

      if (response.success) {
        setMessage('')
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback
          </DialogTitle>
          <DialogDescription>
            Share your thoughts or suggestions about this article. Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'} className="mt-4">
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What do you think about this article? Any suggestions for improvement?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
            disabled={isSubmitting}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
