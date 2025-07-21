'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { submitCoursePartFeedback } from '../feedbacks' // Import the server action
// Assuming payload-types are generated and correct now
import { CoursePartFeedback } from '@/payload-types'

// Define feedback types based on the collection
const feedbackTypes: { value: CoursePartFeedback['feedbackType']; label: string }[] = [
  { label: 'Typo / Spelling Mistake', value: 'typo' },
  { label: 'Technical Error / Bug', value: 'error' },
  { label: 'Unclear Content / Explanation', value: 'unclear' },
  { label: 'Suggestion', value: 'suggestion' },
  { label: 'Other', value: 'other' },
]

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  partId: number
  partName: string
  userId: string | null // Now required by the action, but handle null case for safety
}

export function FeedbackDialog({
  open,
  onOpenChange,
  partId,
  partName,
  userId,
}: FeedbackDialogProps) {
  const { toast } = useToast()
  const [feedbackType, setFeedbackType] = useState<CoursePartFeedback['feedbackType'] | ''>('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setFeedbackType('')
    setDetails('')
    setIsSubmitting(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit feedback.',
        variant: 'destructive',
      })
      return
    }
    if (!feedbackType || !details.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please select a feedback type and provide details.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitCoursePartFeedback({
        partId,
        feedbackType,
        details,
        userId, // Pass the non-null userId
        // url: window.location.href // Optional: include current URL
      })

      if (result.success) {
        toast({
          title: 'Feedback Submitted',
          description: 'Thank you for helping us improve!',
        })
        resetForm()
        onOpenChange(false) // Close the dialog
      } else {
        toast({
          title: 'Submission Failed',
          description: result.error || 'An unknown error occurred.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while submitting feedback.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close dialog resets state
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm()
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Submit Feedback for: {partName}</DialogTitle>
          <DialogDescription>
            Help us improve this course part by sharing your thoughts or reporting issues.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="feedbackType" className="text-right">
              Type
            </Label>
            <Select
              value={feedbackType}
              onValueChange={(value) =>
                setFeedbackType(value as CoursePartFeedback['feedbackType'])
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="feedbackType" className="col-span-3">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                {feedbackTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="details" className="text-right pt-2">
              Details
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide specific details about the issue or your suggestion..."
              className="col-span-3 min-h-[100px]"
              disabled={isSubmitting}
              required
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !feedbackType || !details.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
