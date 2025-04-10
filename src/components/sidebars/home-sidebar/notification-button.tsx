'use client'

import { Bell, Check, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getNotifications,
  setIsRead,
  setAllNotificationsAsRead,
  getReadNotifications,
} from '@/core/notifications'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Notification } from '@/payload-types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export const NotificationButton = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [readNotifications, setReadNotifications] = useState<Notification[]>([])
  const [removingIds, setRemovingIds] = useState<number[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const activeNotifications = useMemo(() => {
    return notifications.filter((n) => !removingIds.includes(n.id))
  }, [notifications, removingIds])

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifs = await getNotifications()
      setNotifications(notifs.filter((n) => !n.isRead))
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    const fetchReadNotifications = async () => {
      if (isHistoryOpen) {
        const readNotifs = await getReadNotifications()
        setReadNotifications(readNotifs)
      }
    }
    fetchReadNotifications()
  }, [isHistoryOpen])

  const handleMarkAsRead = useCallback(async (id: number) => {
    setRemovingIds((prev) => [...prev, id])

    try {
      await setIsRead(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      setRemovingIds((prev) => prev.filter((rid) => rid !== id))
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  const handleMarkAllAsRead = useCallback(async () => {
    const currentIds = notifications.map((n) => n.id)
    setRemovingIds(currentIds)

    try {
      await setAllNotificationsAsRead()
      setNotifications([])
    } catch (error) {
      setRemovingIds([])
      console.error('Failed to mark all notifications as read:', error)
    }
  }, [notifications])

  const getHighestImportance = () => {
    if (activeNotifications.length === 0) return null
    if (activeNotifications.some((n) => n.importance === 'high')) return 'high'
    if (activeNotifications.some((n) => n.importance === 'medium')) return 'medium'
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
          {activeNotifications.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">No new notifications</div>
          ) : (
            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {activeNotifications.map((notification, index) => {
                  const isRemoving = removingIds.includes(notification.id)
                  const isLast = index === activeNotifications.length - 1

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 1, height: 72 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className={cn(
                        'group rounded-lg text-sm cursor-pointer overflow-hidden',
                        'hover:bg-accent',
                        notification.isRead ? 'bg-muted/50' : 'bg-muted',
                        !isLast && 'mb-2',
                      )}
                      onClick={() => !isRemoving && handleMarkAsRead(notification.id)}
                    >
                      <div className="p-2">
                        <div className="flex items-start gap-2">
                          <span
                            className={cn(
                              'mt-1.5 h-2 w-2 rounded-full shrink-0',
                              importanceColor[notification.importance],
                            )}
                          />
                          <div className="flex-1 min-w-0">
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
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              {activeNotifications.length > 0 && (
                <div className="mt-4 transition-opacity duration-150 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-primary/10 transition-colors duration-200"
                    onClick={handleMarkAllAsRead}
                    disabled={removingIds.length > 0}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark all as read
                  </Button>
                  <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-accent transition-colors duration-200"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Notification History</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[50vh]">
                        <div className="flex flex-col gap-2 pr-4">
                          {readNotifications.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-4">
                              No read notifications
                            </div>
                          ) : (
                            readNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={cn('group rounded-lg text-sm p-2', 'bg-muted/50')}
                              >
                                <div className="flex items-start gap-2">
                                  <span
                                    className={cn(
                                      'mt-1.5 h-2 w-2 rounded-full shrink-0',
                                      importanceColor[notification.importance],
                                    )}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p>{notification.content}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                      <span>
                                        {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                                      </span>
                                      <span>•</span>
                                      <span>
                                        {format(new Date(notification.createdAt), 'HH:mm')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
