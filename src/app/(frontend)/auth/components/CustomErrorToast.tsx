'use client'

import { useEffect } from 'react'
import { XCircleIcon, XIcon, CheckCircle2, Info } from 'lucide-react'
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

interface CustomToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export function CustomToast({
  open,
  onOpenChange,
  title,
  description,
  type = 'error',
  duration = 5000,
}: CustomToastProps) {
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

  let icon = null
  let colorClass = ''
  if (type === 'success') {
    icon = (
      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} aria-hidden="true" />
    )
    colorClass = 'text-emerald-500 border-emerald-500 bg-emerald-50'
  } else if (type === 'info') {
    icon = <Info className="mt-0.5 shrink-0 text-sky-500" size={20} aria-hidden="true" />
    colorClass = 'text-sky-500 border-sky-500 bg-sky-50'
  } else {
    icon = <XCircleIcon className="mt-0.5 shrink-0 text-destructive" size={20} aria-hidden="true" />
    colorClass = 'text-destructive border-destructive bg-destructive/10'
  }

  return (
    <ToastProvider swipeDirection="right">
      <Toast
        open={open}
        onOpenChange={onOpenChange}
        onPause={pause}
        onResume={resume}
        className={`border ${colorClass}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex w-full justify-between gap-3 items-start">
          {icon}
          <div className="flex grow flex-col gap-1">
            <ToastTitle className={colorClass}>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </div>
          <ToastClose asChild>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-1.5 size-8 shrink-0 p-0 hover:bg-transparent data-[state=open]:bg-transparent"
              aria-label="Fermer la notification"
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
            className={`pointer-events-none absolute bottom-0 left-0 h-1 w-full ${colorClass}`}
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

// Pour compatibilité descendante
export { CustomToast as CustomErrorToast }
