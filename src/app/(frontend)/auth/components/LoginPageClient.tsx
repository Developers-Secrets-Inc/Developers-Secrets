'use client'
import { useState, useEffect } from 'react'
import { LoginCard } from './LoginCard'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { CustomToast } from './CustomErrorToast'

type LoginAction = (
  email: string,
  password: string,
  rememberMe: boolean,
) => Promise<{ success: boolean; error?: string | { code: string; message: string } }>

export function LoginPageClient({
  loginAction,
  redirectTo,
}: {
  loginAction: LoginAction
  redirectTo?: string
}) {
  const [toastOpen, setToastOpen] = useState(false)
  const [toastProps, setToastProps] = useState<{
    type: 'success' | 'error' | 'info'
    title: string
    description: string
  }>({ type: 'success', title: '', description: '' })

  useEffect(() => {
    const toast = sessionStorage.getItem('postLoginToast')
    if (toast) {
      try {
        const parsed = JSON.parse(toast)
        if (typeof parsed.type === 'string' && ['success', 'error', 'info'].includes(parsed.type)) {
          setToastProps(
            parsed as { type: 'success' | 'error' | 'info'; title: string; description: string },
          )
          setToastOpen(true)
        }
      } catch {}
      sessionStorage.removeItem('postLoginToast')
    }
  }, [])

  return (
    <div className="flex flex-grow justify-center">
      <CustomToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        type={toastProps.type}
        title={toastProps.title}
        description={toastProps.description}
      />
      <div className="flex w-full flex-col md:flex-row">
        <div className="w-full md:w-1/2 pr-4 md:pr-8 border-r border-border py-8 md:py-12 flex flex-col items-center justify-center">
          <LoginCard onSubmit={loginAction} redirectTo={redirectTo} />
        </div>
        <div className="hidden md:block md:w-1/2 md:pl-8 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-full h-1/2 pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom left, white 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom left, white 60%, transparent 100%)',
            }}
          >
            <DotPattern
              width={20}
              height={20}
              cx={1}
              cy={1}
              cr={1}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
