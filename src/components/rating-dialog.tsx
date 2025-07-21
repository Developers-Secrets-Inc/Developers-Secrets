'use client'

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useChallengeRating } from '@/core/challenges/hooks/use-challenge-rating'; // Import the new hook
import { useEffect, useId, useState } from 'react'; // Added useEffect


export const RatingText = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="link"
        className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors"
        onClick={() => setOpen(true)}
      >
        Rate this challenge
      </Button>
      <RatingDialog open={open} setOpen={setOpen} />
    </>
  )
}

interface RatingDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

function RatingDialog({ open, setOpen }: RatingDialogProps) {
  const id = useId()
  const { rating, rate, isSubmitting } = useChallengeRating(() => setOpen(false))
  const [localRating, setLocalRating] = useState<string>(rating?.toString() || '')

  useEffect(() => {
    if (rating != null) {
      // Check for both null and undefined
      setLocalRating(rating.toString())
    } else {
      setLocalRating('') // Ensure RadioGroup value is always a string
    }
  }, [rating])

  const handleSubmit = async () => {
    if (localRating === undefined || localRating === null) return // Ensure localRating is not undefined or null

    const numericRating = parseInt(localRating, 10)
    await rate({ newRating: numericRating })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate this challenge</DialogTitle>
          <DialogDescription>Please provide your feedback on this challenge</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <fieldset className="space-y-4">
            <legend className="text-foreground text-sm leading-none font-medium">
              How would you rate this challenge?
            </legend>
            <RadioGroup
              className="flex gap-0 -space-x-px rounded-md shadow-xs"
              value={localRating}
              onValueChange={setLocalRating}
            >
              {['0', '1', '2', '3', '4', '5'].map((value) => (
                <label
                  key={value}
                  className="border-input has-[data-state=checked]:border-ring focus-within:border-ring focus-within:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm font-medium transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md focus-within:ring-[3px] has-[data-disabled]:cursor-not-allowed has-[data-disabled]:opacity-50 has-[data-state=checked]:z-10"
                >
                  <RadioGroupItem
                    id={`${id}-${value}`}
                    value={value}
                    className="sr-only after:absolute after:inset-0"
                  />
                  {value}
                </label>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="mt-1 flex justify-between text-xs font-medium">
            <p>
              <span className="text-base">😡</span> Not good
            </p>
            <p>
              Excellent <span className="text-base">😍</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
