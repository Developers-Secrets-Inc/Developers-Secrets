'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface RatingTextProps {
  text?: string
  className?: string
}

export function RatingText({
  text = 'Rate this challenge',
  className = 'text-xs text-muted-foreground',
}: RatingTextProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={`${className} cursor-pointer hover:text-primary transition-colors`}
        onClick={() => setOpen(true)}
      >
        {text}
      </div>
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
  const [rating, setRating] = useState<string | undefined>()

  const handleSubmit = () => {
    // Here you would handle the submission of the rating
    console.log('Rating submitted:', rating)
    setOpen(false)
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
              How likely are you to recommend us?
            </legend>
            <RadioGroup
              className="flex gap-0 -space-x-px rounded-md shadow-xs"
              value={rating}
              onValueChange={setRating}
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
              <span className="text-base">😡</span> Not likely
            </p>
            <p>
              Very Likely <span className="text-base">😍</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
