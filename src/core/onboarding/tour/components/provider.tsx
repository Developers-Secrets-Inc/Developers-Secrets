'use client'

import React, { useMemo, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { STATUS, type Step, type CallBackProps } from 'react-joyride'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { onboardingRegistry } from '@/core/onboarding/tour/registry'
import type { AppRoute } from '@/core/onboarding/tour/index'
import { CustomTooltip } from '@/core/onboarding/tour/components/Tooltip'
import { setPageVisited } from '@/core/onboarding/tour/index'
import { useMutation } from '@/core/functions/hooks'
import { useSessionUser } from '@/core/user/hooks/use-user'

const Joyride = dynamic(() => import('react-joyride'), { ssr: false })

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const pathnameRaw = usePathname() ?? ''
  const search = useSearchParams()
  const router = useRouter()
  const visitedRef = useRef(false)
  const { user } = useSessionUser()
  const { mutate: markVisited } = useMutation(setPageVisited)

  const shouldStart = Boolean(search.get('onboarding'))

  const routeKey = (pathnameRaw in onboardingRegistry ? (pathnameRaw as AppRoute) : '') as AppRoute | ''

  const tour = useMemo(() => (routeKey ? onboardingRegistry[routeKey] : undefined), [routeKey])

  const steps = useMemo<Step[]>(
    () =>
      tour
        ? tour.steps.map((s) => ({
            target: `[data-onboarding-step="${s.id}"]`,
            title: s.title,
            content: s.content,
            placement: s.placement ?? 'auto',
            disableBeacon: true,
          }))
        : [],
    [tour],
  )

  const run = shouldStart && steps.length > 0

  const handleJoyride = useCallback(
    (data: CallBackProps) => {
      const { status } = data
      if (visitedRef.current) return
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        visitedRef.current = true
        if (user?.id && routeKey) {
          markVisited({ userId: user.id, path: routeKey })
        }
        // Remove ?onboarding while staying on the same page
        router.replace(window.location.pathname + window.location.hash)
      }
    },
    [routeKey, router, user?.id, markVisited],
  )

  return (
    <>
      {children}
      {run && (
        <Joyride
          steps={steps}
          run={run}
          showSkipButton
          showProgress
          continuous
          disableScrolling
          tooltipComponent={CustomTooltip}
          callback={handleJoyride}
          styles={{ options: { zIndex: 9999 } }}
        />
      )}
    </>
  )
}
