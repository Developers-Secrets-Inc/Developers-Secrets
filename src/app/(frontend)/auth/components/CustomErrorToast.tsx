'use client'

import { useEffect } from 'react'
import { XCircleIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useProgressTimer } from '@/hooks/use-progress-timer'

interface CustomErrorToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  duration?: number
}

export function CustomErrorToast({
  open,
  onOpenChange,
  title,
  description,
  duration = 5000,
}: CustomErrorToastProps) {
  const { progress, start, pause, resume, reset } = useProgressTimer({
    duration,
    onComplete: () => onOpenChange(false),
  })

  useEffect(() => {
    if (open) {
      reset()
      start()
    }
  }, [open, reset, start])

  return (
    <ToastProvider swipeDirection="right">
      <Toast
        open={open}
        onOpenChange={onOpenChange}
        onPause={pause}
        onResume={resume}
        className="border-destructive"
      >
        <div className="flex w-full justify-between gap-3 items-start">
          <XCircleIcon className="mt-0.5 shrink-0 text-destructive" size={20} aria-hidden="true" />
          <div className="flex grow flex-col gap-1">
            <ToastTitle className="text-destructive">{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </div>
          <ToastClose asChild>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-1.5 size-8 shrink-0 p-0 hover:bg-transparent data-[state=open]:bg-transparent"
              aria-label="Close notification"
            >
              <XIcon
                size={16}
                className="text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </ToastClose>
        </div>
        <div className="contents" aria-hidden="true">
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-destructive"
            style={{
              width: `${(progress / duration) * 100}%`,
              transition: 'width 100ms linear',
            }}
          />
        </div>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  )
}
