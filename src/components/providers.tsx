'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { NotificationProvider } from '@/core/notifications/notification-provider'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useState } from 'react'
import { OnboardingProvider } from '@/core/onboarding/tour/components/provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <TooltipProvider>
          <NuqsAdapter>
            <NotificationProvider>
              <OnboardingProvider>{children}</OnboardingProvider>
            </NotificationProvider>
          </NuqsAdapter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
