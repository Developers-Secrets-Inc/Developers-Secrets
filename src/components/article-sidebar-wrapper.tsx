'use client'

import { useState } from 'react'
import { SupportDialog } from './support-dialog'
import { FeedbackDialog } from './feedback-dialog'
import { getSupportStatus } from '@/actions/support'
import { useEffect } from 'react'

interface ArticleSidebarWrapperProps {
  children: React.ReactNode
}

export function ArticleSidebarWrapper({ children }: ArticleSidebarWrapperProps) {
  const [supportDialogOpen, setSupportDialogOpen] = useState(false)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [supportStatus, setSupportStatus] = useState({
    status: 'online' as 'online' | 'maintenance' | 'offline',
    message: '',
  })

  // Fetch support status on mount
  useEffect(() => {
    const fetchSupportStatus = async () => {
      try {
        const status = await getSupportStatus()
        // Assurez-vous que le statut est l'un des types attendus
        const validStatus = status.status as 'online' | 'maintenance' | 'offline'
        setSupportStatus({
          status: validStatus,
          message: status.message,
        })
      } catch (error) {
        console.error('Error fetching support status:', error)
      }
    }

    fetchSupportStatus()
  }, [])

  // Handle clicks on support and feedback links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const closestLink = target.closest('a')

      if (closestLink) {
        if (closestLink.getAttribute('href') === '#support') {
          e.preventDefault()
          setSupportDialogOpen(true)
        } else if (closestLink.getAttribute('href') === '#feedback') {
          e.preventDefault()
          setFeedbackDialogOpen(true)
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <>
      {children}

      <SupportDialog
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
        supportStatus={supportStatus}
      />

      <FeedbackDialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen} />
    </>
  )
}
