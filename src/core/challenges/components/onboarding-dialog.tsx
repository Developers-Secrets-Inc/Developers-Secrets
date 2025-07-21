'use client'

import { useEffect, useState } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const OnboardingDialog = () => {
  const [step, setStep] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('onboarding') === 'true') {
      setIsOpen(true)
    }
  }, [searchParams])

  const stepContent = [
    {
      title: 'Welcome to Origin UI',
      description:
        'Discover a powerful collection of components designed to enhance your development workflow.',
    },
    {
      title: 'Customizable Components',
      description:
        'Each component is fully customizable and built with modern web standards in mind.',
    },
    {
      title: 'Ready to Start?',
      description: 'Begin building amazing interfaces with our comprehensive component library.',
    },
    {
      title: 'Get Support',
      description:
        'Access our extensive documentation and community resources to make the most of Origin UI.',
    },
  ]

  const totalSteps = stepContent.length

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1)
        setIsOpen(open)
      }}
      open={isOpen}
    >
      <DialogContent>
        <div>
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>{stepContent[step - 1].description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'bg-primary size-1.5 rounded-full',
                    index + 1 === step ? 'bg-primary' : 'opacity-20',
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button className="group" type="button" onClick={handleContinue}>
                  Next
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button type="button">Okay</Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
