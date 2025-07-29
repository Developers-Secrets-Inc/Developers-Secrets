import React from 'react'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '@/components/providers'
import { Metadata } from 'next'
import { RootProvider } from 'fumadocs-ui/provider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  description: 'The best platform for learning to code',
  title: 'Developers Secrets',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* Pyodide script will be loaded on the client side */}</head>
      <body
        className={inter.className}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Providers>
          <RootProvider>
            <Script
              src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
              strategy="beforeInteractive"
            />
            <main>{children}</main>
            <Toaster position="bottom-right" richColors closeButton expand={false} duration={4000} />
          </RootProvider>
        </Providers>
        <SpeedInsights />
        <Analytics mode="production" />

        {/* Initialize Pyodide */}
      </body>
    </html>
  )
}

/*  

        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize Pyodide when the script is loaded
              document.addEventListener('DOMContentLoaded', async () => {
                try {
                  // Set a global flag indicating Pyodide is loading
                  window.isPyodideLoading = true;
                  
                  console.log('Loading Pyodide...');
                  // Load Pyodide
                  window.pyodide = await loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/'
                  });
                  
                  // Load micropip for package management
                  await window.pyodide.loadPackagesFromImports('import micropip');
                  
                  // Update the global flag indicating Pyodide is loaded
                  window.isPyodideLoading = false;
                  window.isPyodideLoaded = true;
                  
                  console.log('Pyodide loaded successfully');
                  
                  // Dispatch a custom event to notify components that Pyodide is ready
                  document.dispatchEvent(new CustomEvent('pyodideLoaded'));
                } catch (error) {
                  console.error('Failed to load Pyodide:', error);
                  window.isPyodideLoading = false;
                  window.pyodideLoadError = error.message || 'Unknown error';
                  
                  // Dispatch an event to notify components that Pyodide failed to load
                  document.dispatchEvent(new CustomEvent('pyodideLoadError', { 
                    detail: { error: error.message || 'Unknown error' } 
                  }));
                }
              });
            `,
          }}
        />

*/
