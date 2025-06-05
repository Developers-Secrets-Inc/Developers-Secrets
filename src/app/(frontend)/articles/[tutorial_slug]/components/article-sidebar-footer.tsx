'use client'

import { HelpCircle, MessageSquare } from 'lucide-react'

import { CreateAccountCTA } from '@/components/cards/create-account-cta'
import { FeedbackDialog } from '@/components/feedback-dialog'
import { SupportDialog } from '@/components/support-dialog'
import { Badge } from '@/components/ui/badge'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useState } from 'react'
import { useEffect } from 'react'
import { getSupportStatus as fetchSupportStatus } from '@/actions/support'

export const ArticleSidebarFooter = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [supportStatus, setSupportStatus] = useState<{
    status: 'online' | 'maintenance' | 'offline'
    message: string
  }>({
    status: 'online',
    message: '',
  })

  // Fetch support status on component mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await fetchSupportStatus()
        setSupportStatus(
          status as {
            status: 'online' | 'maintenance' | 'offline'
            message: string
          },
        )
      } catch (error) {
        console.error('Failed to fetch support status:', error)
      }
    }

    fetchStatus()
  }, [])

  // Use cached functions

  // Determine the status indicator color

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => setFeedbackOpen(true)} className="cursor-pointer flex justify-between w-full">
              <span className="flex items-center gap-2">
                <MessageSquare className="size-4" />
                Feedback
              </span>
              <FeedbackIcon />
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton className="cursor-pointer flex justify-between w-full">
            <span className="flex items-center gap-2">
              <HelpCircle className="size-4" />
              Support
            </span>
            <SupportStatusBadge status={supportStatus.status} />
          </SidebarMenuButton>
        </SidebarMenuItem>

        <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />

        <SupportDialog
          open={supportOpen}
          onOpenChange={setSupportOpen}
          supportStatus={supportStatus}
        />
      </SidebarMenu>
      <CreateAccountCTA />
    </SidebarFooter>
  )
}

const FeedbackIcon = () => {
  return (
    <svg
      className="text-muted-foreground"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SupportStatusBadge = ({ status }: { status: 'online' | 'maintenance' | 'offline' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500'
      case 'maintenance':
        return 'bg-amber-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-emerald-500'
    }
  }

  return (
    <Badge variant="outline" className="gap-1.5 rounded-sm">
      <span className={`size-1.5 rounded-full ${getStatusColor()}`} aria-hidden="true"></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
