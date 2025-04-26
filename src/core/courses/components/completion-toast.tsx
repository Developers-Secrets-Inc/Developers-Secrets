'use client'

import { CircleCheckIcon, XIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastTitle
} from '@/components/ui/toast'
import type { PartCompletionToastProps } from './completion-toast-context'; // Import the props type

interface UseProgressTimerProps {
  duration: number
  interval?: number
  onComplete?: () => void
}

function useProgressTimer({ duration, interval = 100, onComplete }: UseProgressTimerProps) {
  const [progress, setProgress] = useState(duration)
  const timerRef = useRef<number>(0)
  const timerState = useRef({
    startTime: 0,
    remaining: duration,
    isPaused: false,
  })

  const cleanup = useCallback(() => {
    window.clearInterval(timerRef.current)
  }, [])

  const reset = useCallback(
    (newDuration?: number) => {
      cleanup()
      const durationToSet = newDuration ?? timerState.current.remaining // Use new duration or fallback
      setProgress(durationToSet)
      timerState.current = {
        startTime: 0,
        remaining: durationToSet,
        isPaused: false,
      }
    },
    [cleanup],
  )

  const start = useCallback(() => {
    const state = timerState.current
    // If already running or finished, don't restart without reset
    if (timerRef.current !== 0 && !state.isPaused) return
    // If paused, remaining time is already correct
    if (!state.isPaused) {
      state.remaining = progress // Use current progress if starting fresh
    }
    state.startTime = Date.now()
    state.isPaused = false

    timerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - state.startTime
      const remaining = Math.max(0, state.remaining - elapsedTime)

      setProgress(remaining)

      if (remaining <= 0) {
        cleanup()
        onComplete?.()
      }
    }, interval)
  }, [interval, cleanup, onComplete, progress])

  const pause = useCallback(() => {
    const state = timerState.current
    if (!state.isPaused && timerRef.current !== 0) {
      cleanup()
      state.remaining = Math.max(0, progress) // Update remaining based on current progress
      state.isPaused = true
    }
  }, [cleanup, progress])

  const resume = useCallback(() => {
    const state = timerState.current
    if (state.isPaused && state.remaining > 0) {
      start() // start() will use the updated state.remaining
    }
  }, [start])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    progress,
    start,
    pause,
    resume,
    reset,
  }
}

interface PartCompletionToastInternalProps {
  isOpen: boolean
  props: PartCompletionToastProps | null // Props received from context
  onClose: () => void // Function to call when toast should close
}

export function PartCompletionToastInternal({
  isOpen,
  props,
  onClose,
}: PartCompletionToastInternalProps) {
  const toastDuration = 5000
  const { progress, start, pause, resume, reset } = useProgressTimer({
    duration: toastDuration,
    onComplete: onClose, // Call onClose when timer finishes
  })

  // Effect to control the timer based on isOpen changes
  useEffect(() => {
    if (isOpen) {
      reset(toastDuration) // Reset with the full duration when opening
      start()
    } else {
      // Optional: pause or reset when closing externally if needed
      // pause();
    }
    // Only re-run when isOpen changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Guard against rendering without props when open
  if (!props && isOpen) {
    console.error('PartCompletionToastInternal rendered open without props!')
    return null
  }
  if (!props) {
    // Don't render anything if closed and no props
    return null
  }

  // Determine description based on received props
  const description = props.solutionUnlocked
    ? 'Part completed, but no XP earned as the solution was viewed.'
    : `Congratulations, you earned ${props.xpEarned} XP!`

  // We need the ToastProvider and Viewport higher up (now in completion-toast-context.tsx)
  // So we only render the Toast component itself here.
  return (
    <Toast
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose() // Ensure onClose is called when shadcn closes it (e.g., swipe)
        }
      }}
      onPause={pause}
      onResume={resume}
      duration={toastDuration} // Pass duration for swipe/hover behavior
    >
      <div className="flex w-full justify-between gap-3">
        <CircleCheckIcon
          className="mt-0.5 shrink-0 text-emerald-500"
          size={16}
          aria-hidden="true"
        />
        <div className="flex grow flex-col gap-3">
          <div className="space-y-1">
            <ToastTitle>Part Completed!</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </div>
        </div>
        <ToastClose asChild onClick={onClose}>
          {' '}
          {/* Ensure manual close calls onClose */}
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            aria-label="Close notification"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </ToastClose>
      </div>
      {/* Progress Bar */}
      <div className="contents" aria-hidden="true">
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-emerald-500"
          style={{
            width: `${(progress / toastDuration) * 100}%`,
            transition: 'width 100ms linear',
          }}
        />
      </div>
    </Toast>
    // No need for Provider/Viewport here anymore
  )
}
