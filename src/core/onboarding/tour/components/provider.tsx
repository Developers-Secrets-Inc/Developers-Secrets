'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { Step } from 'react-joyride'
import { usePathname, useSearchParams } from 'next/navigation'
import { onboardingRegistry } from '@/core/onboarding/tour/registry'
import type { AppRoute } from '@/core/onboarding/tour/index'
import { CustomTooltip } from '@/core/onboarding/tour/components/Tooltip'

const Joyride = dynamic(() => import('react-joyride'), { ssr: false })

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const pathnameRaw = usePathname() ?? ''
  const search = useSearchParams()

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
          styles={{ options: { zIndex: 9999 } }}
        />
      )}
    </>
  )
}
