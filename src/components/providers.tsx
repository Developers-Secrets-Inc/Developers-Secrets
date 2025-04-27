'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
// import { Toaster } from '@/components/ui/toaster' // Removed shadcn Toaster
import { CompletionToastProvider } from '@/core/courses/components/completion-toast-context' // Added custom provider
import { useState } from 'react'

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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {/* Wrap with the custom completion toast provider */}
        <CompletionToastProvider>
          {children}
          {/* The actual Toast component is rendered inside CompletionToastProvider */}
        </CompletionToastProvider>
        {/* <Toaster /> // Removed */}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
