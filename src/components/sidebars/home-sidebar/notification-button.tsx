'use client'

import { Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getNotifications, setIsRead, setAllNotificationsAsRead } from '@/core/notifications'
import { useEffect, useState } from 'react'
import { Notification } from '@/payload-types'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

export const NotificationButton = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifs = await getNotifications()
      setNotifications(notifs.filter((n) => !n.isRead))
    }
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: number) => {
    await setIsRead(id)
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleMarkAllAsRead = async () => {
    await setAllNotificationsAsRead()
    setNotifications([])
  }

  const getHighestImportance = () => {
    if (notifications.length === 0) return null
    if (notifications.some((n) => n.importance === 'high')) return 'high'
    if (notifications.some((n) => n.importance === 'medium')) return 'medium'
    return 'low'
  }

  const importanceColor = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-blue-500',
  }

  const highestImportance = getHighestImportance()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {highestImportance && (
            <span
              className={cn(
                'absolute top-1 right-1 h-2 w-2 rounded-full',
                importanceColor[highestImportance],
              )}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">No new notifications</div>
          ) : (
            <>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        scale: 0.95,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                        opacity: { duration: 0.2 },
                      }}
                      className={cn(
                        'group p-2 rounded-lg text-sm overflow-hidden cursor-pointer',
                        'hover:bg-accent transition-colors duration-200',
                        notification.isRead ? 'bg-muted/50' : 'bg-muted',
                      )}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            'mt-1.5 h-2 w-2 rounded-full shrink-0',
                            importanceColor[notification.importance],
                          )}
                        />
                        <div className="flex-1">
                          <p>{notification.content}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{format(new Date(notification.createdAt), 'MMM d, yyyy')}</span>
                            <span>•</span>
                            <span>{format(new Date(notification.createdAt), 'HH:mm')}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <motion.div
                className="mt-4 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-primary/10 transition-colors duration-200"
                  onClick={handleMarkAllAsRead}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
