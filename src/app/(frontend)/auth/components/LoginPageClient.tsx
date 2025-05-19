'use client'
import { useState, useEffect } from 'react'
import { LoginCard } from './LoginCard'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { CustomToast } from './CustomErrorToast'
import { cn } from '@/lib/utils'

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

  return <LoginCard onSubmit={loginAction} redirectTo={redirectTo} />
}


//  <CustomToast
//       open={toastOpen}
//       onOpenChange={setToastOpen}
//       type={toastProps.type}
//       title={toastProps.title}
//       description={toastProps.description}
//     /> 

