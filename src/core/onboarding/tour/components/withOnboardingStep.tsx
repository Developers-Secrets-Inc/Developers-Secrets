import React, { forwardRef } from 'react'

type WithOnboardingStepOptions = {
  stepId: string
}

export function withOnboardingStep<P extends object>(
  Component: React.ComponentType<P>,
  options: WithOnboardingStepOptions,
) {
  const Wrapped = forwardRef<any, P>(function Wrapped(props, ref) {
    return (
      <div data-onboarding-step={options.stepId}>
        <Component ref={ref as any} {...(props as P)} />
      </div>
    )
  })

  Wrapped.displayName = `WithOnboardingStep(${Component.displayName || Component.name || 'Component'})`
  return Wrapped
}