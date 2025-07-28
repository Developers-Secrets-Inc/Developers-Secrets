'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMutation } from '@/core/functions/hooks'
// import { upsertChallengeRating } from '@/api/challenges/engagement/rating'
import { useId, useState } from 'react'

const NotGoodReview = () => {
  return (
    <p>
      <span className="text-base">😡</span> Not good
    </p>
  )
}

const ExcellentReview = () => {
  return (
    <p>
      Excellent <span className="text-base">😍</span>
    </p>
  )
}

const RatingDialogRadioGroup = ({
  value,
  onValueChange,
  id,
}: {
  value: string
  onValueChange: (v: string) => void
  id: string
}) => {
  return (
    <RadioGroup
      className="flex gap-0 -space-x-px rounded-md shadow-xs"
      value={value}
      onValueChange={onValueChange}
    >
      {['0', '1', '2', '3', '4', '5'].map((val) => (
        <label
          key={val}
          className="border-input has-[data-state=checked]:border-ring focus-within:border-ring focus-within:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm font-medium transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md focus-within:ring-[3px] has-[data-disabled]:cursor-not-allowed has-[data-disabled]:opacity-50 has-[data-state=checked]:z-10"
        >
          <RadioGroupItem
            id={`${id}-${val}`}
            value={val}
            className="sr-only after:absolute after:inset-0"
          />
          {val}
        </label>
      ))}
    </RadioGroup>
  )
}

const RatingDialog = ({
  open,
  onOpenChange,
  userId,
  coursePartId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  coursePartId: number
}) => {
  const id = useId()
  const [localRating, setLocalRating] = useState('0')
//   const mutation = useMutation(upsertChallengeRating, {
//     onSuccess: () => {
//       onOpenChange(false)
//     },
//   })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // mutation.mutate({
    //   userId,
    //   challengeId,
    //   rating: Number(localRating),
    // })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate this challenge</DialogTitle>
          <DialogDescription>Please provide your feedback on this challenge</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <fieldset className="space-y-4">
              <legend className="text-foreground text-sm leading-none font-medium">
                How would you rate this challenge?
              </legend>
              <RatingDialogRadioGroup value={localRating} onValueChange={setLocalRating} id={id} />
            </fieldset>
            <div className="mt-1 flex justify-between text-xs font-medium">
              <NotGoodReview />
              <ExcellentReview />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={false}>
              {/* {mutation.isPending ? 'Submitting...' : 'Submit Rating'} */}
              Submit Rating
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const RatingButtonPure = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="link"
      className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors"
      onClick={onClick}
    >
      Rate this challenge
    </Button>
  )
}

export const RatingDialogButton = ({
  userId,
  coursePartId,
}: {
  userId: string
  coursePartId: number
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <RatingButtonPure onClick={() => setOpen(true)} />
      <RatingDialog open={open} onOpenChange={setOpen} userId={userId} coursePartId={coursePartId} />
    </>
  )
}
