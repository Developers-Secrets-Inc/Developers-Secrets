'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster' // Re-added shadcn Toaster
import { Toaster as Sonner } from '@/components/ui/sonner' // Re-added shadcn Toaster
import { CompletionToastProvider } from '@/core/courses/components/completion-toast-context' // Added custom provider
import { NotificationProvider } from '@/core/notifications/notification-provider'
import { useState } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { TooltipProvider } from '@radix-ui/react-tooltip'

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
            <NotificationProvider>{children}</NotificationProvider>
          </NuqsAdapter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
