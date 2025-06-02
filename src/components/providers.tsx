'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster' // Re-added shadcn Toaster
import { CompletionToastProvider } from '@/core/courses/components/completion-toast-context' // Added custom provider
import { NotificationProvider } from '@/core/notifications/notification-provider'
import { useState } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'


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
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {/* Wrap with the custom completion toast provider */}
        <CompletionToastProvider>
          <NuqsAdapter>
            <NotificationProvider>{children}</NotificationProvider>
          </NuqsAdapter>
          {/* The actual Toast component is rendered inside CompletionToastProvider */}
        </CompletionToastProvider>
        <Toaster /> {/* Re-added */}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
