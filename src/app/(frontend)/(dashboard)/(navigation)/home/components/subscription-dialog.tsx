"use client"

import { ArrowRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SubscriptionDialogProps {
  open: boolean
  onClose: () => void
}

export const SubscriptionDialog = ({ open, onClose }: SubscriptionDialogProps) => {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleClose = () => {
    onClose()
    setStep(1)
    // Remove the subscribed parameter from URL
    router.replace('/home')
  }

  const handleContinue = () => {
    if (step < stepContent.length) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  const stepContent = [
    {
      title: "Welcome to Pro!",
      description: "You've unlocked premium access. Discover everything you now have access to, including advanced features, exclusive content, and priority support that will accelerate your development journey.",
    },
    {
      title: "Unlimited Content",
      description: "Explore our complete library of premium resources, tutorials, and challenges. Get unlimited access to cutting-edge courses, AI-powered coding challenges, and comprehensive guides that will level up your skills.",
    },
    {
      title: "Community & Support",
      description: "Join our private community of expert developers and get priority support. Connect with like-minded professionals, share knowledge, and receive personalized assistance from our dedicated support team.",
    },
    {
      title: "Ready to Start?",
      description: "Your Pro journey begins now! You have everything you need to accelerate your growth as a developer. Let's explore together and unlock your full potential with our premium platform.",
    },
  ]

  const totalSteps = stepContent.length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white sm:max-w-lg">
        <div className="space-y-8 px-8 py-12">
          <DialogHeader className="space-y-4">
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-primary size-1.5 rounded-full",
                    index + 1 === step ? "bg-primary" : "opacity-20"
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
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                >
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
