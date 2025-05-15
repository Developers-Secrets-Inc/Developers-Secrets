import { LoginCard } from '../components/LoginCard'
import { login } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { useEffect, useState } from 'react'
import { CustomToast } from '../components/CustomErrorToast'

export default function LoginPage() {
  const [toastOpen, setToastOpen] = useState(false)
  const [toastProps, setToastProps] = useState<{
    type: 'success' | 'error' | 'info'
    title: string
    description: string
  }>({ type: 'success', title: '', description: '' })

  useEffect(() => {
    // Vérifie si un toast post-login doit être affiché (après redirection)
    const toast = sessionStorage.getItem('postLoginToast')
    if (toast) {
      try {
        const parsed = JSON.parse(toast)
        setToastProps(parsed)
        setToastOpen(true)
      } catch {}
      sessionStorage.removeItem('postLoginToast')
    }
  }, [])

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    'use server'
    return await login(email, password, rememberMe)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <CustomToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        type={toastProps.type}
        title={toastProps.title}
        description={toastProps.description}
      />
      <HomeHeader />
      <div className="flex flex-grow justify-center">
        <div className="flex w-full">
          <div className="w-1/2 pr-8 border-r border-border py-12 flex flex-col items-center justify-center">
            <LoginCard onSubmit={handleLogin} />
          </div>
          <div className="w-1/2 pl-8">
            {/* Content for the right column can be added here later */}
          </div>
        </div>
      </div>
    </div>
  )
}
