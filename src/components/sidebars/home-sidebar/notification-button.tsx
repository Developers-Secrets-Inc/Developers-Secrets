'use client'

import { Bell, Check, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { setIsRead, setAllNotificationsAsRead, getReadNotifications } from '@/core/notifications'
import { useState, useCallback, useMemo } from 'react'
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
import { useNotifications } from '@/core/notifications/hooks/use-notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

export const NotificationButton = () => {
  const queryClient = useQueryClient()
  const { data: notifications = [] } = useNotifications()
  const [removingIds, setRemovingIds] = useState<number[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  const activeNotifications = useMemo(() => {
    return notifications.filter((n) => !n.isRead && !removingIds.includes(n.id))
  }, [notifications, removingIds])

  const { data: readNotificationsData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['readNotifications', currentPage],
    queryFn: () => getReadNotifications({ page: currentPage, limit: ITEMS_PER_PAGE }),
    enabled: isHistoryOpen,
  })

  // Get total pages from the first page response
  const { data: firstPageData } = useQuery({
    queryKey: ['readNotifications', 1],
    queryFn: () => getReadNotifications({ page: 1, limit: ITEMS_PER_PAGE }),
    enabled: isHistoryOpen,
  })

  const readNotifications = readNotificationsData?.docs ?? []
  const totalDocs = firstPageData?.totalDocs ?? 0
  const totalPages = Math.ceil(totalDocs / ITEMS_PER_PAGE)

  const markAsReadMutation = useMutation({
    mutationFn: setIsRead,
    onMutate: async (id) => {
      setRemovingIds((prev) => [...prev, id])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['readNotifications'] })
    },
    onError: (error, id) => {
      setRemovingIds((prev) => prev.filter((rid) => rid !== id))
      console.error('Failed to mark notification as read:', error)
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: setAllNotificationsAsRead,
    onMutate: () => {
      const currentIds = notifications.map((n) => n.id)
      setRemovingIds(currentIds)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['readNotifications'] })
    },
    onError: (error) => {
      setRemovingIds([])
      console.error('Failed to mark all notifications as read:', error)
    },
  })

  const handleMarkAsRead = useCallback(
    (id: number) => {
      markAsReadMutation.mutate(id)
    },
    [markAsReadMutation],
  )

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate()
  }, [markAllAsReadMutation])

  const getHighestImportance = () => {
    if (activeNotifications.length === 0) return null
    if (activeNotifications.some((n) => n.importance === 'high')) return 'high'
    if (activeNotifications.some((n) => n.importance === 'medium')) return 'medium'
    return 'low'
  }

  const importanceColor = {
    high: {
      background: 'bg-red-500/10',
      text: 'text-red-500',
      border: 'border-red-500/20',
      hover: 'hover:bg-red-500/20',
    },
    medium: {
      background: 'bg-orange-500/10',
      text: 'text-orange-500',
      border: 'border-orange-500/20',
      hover: 'hover:bg-orange-500/20',
    },
    low: {
      background: 'bg-blue-500/10',
      text: 'text-blue-500',
      border: 'border-blue-500/20',
      hover: 'hover:bg-blue-500/20',
    },
  }

  const highestImportance = getHighestImportance()

  const renderPaginationItems = () => {
    const items = []

    // Show first page
    if (currentPage > 2) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>,
      )
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
    }

    // Show current page
    items.push(
      <PaginationItem key={currentPage}>
        <PaginationLink isActive={true}>{currentPage}</PaginationLink>
      </PaginationItem>,
    )

    // Show last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {highestImportance && (
            <span
              className={cn(
                'absolute top-1 right-1 h-2 w-2 rounded-full',
                importanceColor[highestImportance].background,
                importanceColor[highestImportance].text,
              )}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          {activeNotifications.length === 0 ? (
            <div className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">No new notifications</div>
              <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full hover:bg-accent transition-colors duration-200"
                  >
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notification History</DialogTitle>
                  </DialogHeader>
                  <div
                    className="flex flex-col"
                    style={{ height: 'calc((6 * (72px + 8px)) + 64px)' }}
                  >
                    <ScrollArea className="flex-1 px-1">
                      <div className="flex flex-col gap-2">
                        {isLoadingHistory ? (
                          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                            <div
                              key={`skeleton-${index}`}
                              className="group relative rounded-lg text-sm overflow-hidden bg-muted/20 h-[72px]"
                            >
                              <div className="p-3">
                                <div className="flex items-start gap-3">
                                  <Skeleton className="flex-shrink-0 rounded-full w-8 h-8" />
                                  <div className="flex-1 min-w-0">
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <div className="flex items-center gap-2">
                                      <Skeleton className="h-3 w-20" />
                                      <Skeleton className="h-3 w-16" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : readNotifications.length === 0 ? (
                          <div className="text-center text-sm text-muted-foreground py-4">
                            No read notifications
                          </div>
                        ) : (
                          readNotifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className={cn(
                                'group relative rounded-lg text-sm overflow-hidden h-[72px]',
                                'bg-muted/20 hover:bg-muted/30 transition-colors duration-200',
                              )}
                            >
                              <div className="p-3">
                                <div className="flex items-start gap-3">
                                  <div
                                    className={cn(
                                      'flex-shrink-0 rounded-full p-2 flex items-center justify-center w-8 h-8',
                                      importanceColor[notification.importance].background,
                                      importanceColor[notification.importance].text,
                                    )}
                                  >
                                    <Bell className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="line-clamp-2 leading-snug">
                                      {notification.content}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                                      <span>
                                        {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                                      </span>
                                      <span className="text-muted-foreground/40">•</span>
                                      <span>
                                        {format(new Date(notification.createdAt), 'HH:mm')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                    <div className="py-4 border-t">
                      <Pagination className="flex justify-center">
                        <PaginationContent className="flex flex-wrap justify-center gap-1">
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              className={cn(
                                'cursor-pointer',
                                currentPage === 1 && 'pointer-events-none opacity-50',
                              )}
                            />
                          </PaginationItem>
                          {renderPaginationItems()}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                              className={cn(
                                'cursor-pointer',
                                currentPage === totalPages && 'pointer-events-none opacity-50',
                              )}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                        'group relative rounded-lg text-sm overflow-hidden transition-colors duration-200',
                        'hover:bg-accent hover:text-accent-foreground',
                        notification.isRead ? 'bg-muted/50' : 'bg-muted/20',
                        !isLast && 'mb-2',
                      )}
                      onClick={() => !isRemoving && handleMarkAsRead(notification.id)}
                    >
                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'flex-shrink-0 rounded-full p-2 flex items-center justify-center w-8 h-8',
                              notification.isRead
                                ? 'bg-muted-foreground/10 text-muted-foreground'
                                : cn(
                                    importanceColor[notification.importance].background,
                                    importanceColor[notification.importance].text,
                                  ),
                            )}
                          >
                            <Bell className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                'line-clamp-2 leading-snug',
                                !notification.isRead && 'font-medium',
                              )}
                            >
                              {notification.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                              <span>{format(new Date(notification.createdAt), 'MMM d, yyyy')}</span>
                              <span className="text-muted-foreground/40">•</span>
                              <span>{format(new Date(notification.createdAt), 'HH:mm')}</span>
                            </div>
                          </div>
                          <div
                            className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
                              'opacity-0 group-hover:opacity-100',
                              'bg-primary/10 text-primary',
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
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
                    <div
                      className="flex flex-col"
                      style={{ height: 'calc((6 * (72px + 8px)) + 64px)' }}
                    >
                      <ScrollArea className="flex-1 px-1">
                        <div className="flex flex-col gap-2">
                          {isLoadingHistory ? (
                            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                              <div
                                key={`skeleton-${index}`}
                                className="group relative rounded-lg text-sm overflow-hidden bg-muted/20 h-[72px]"
                              >
                                <div className="p-3">
                                  <div className="flex items-start gap-3">
                                    <Skeleton className="flex-shrink-0 rounded-full w-8 h-8" />
                                    <div className="flex-1 min-w-0">
                                      <Skeleton className="h-4 w-3/4 mb-2" />
                                      <div className="flex items-center gap-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-16" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : readNotifications.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-4">
                              No read notifications
                            </div>
                          ) : (
                            readNotifications.map((notification) => (
                              <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                  'group relative rounded-lg text-sm overflow-hidden h-[72px]',
                                  'bg-muted/20 hover:bg-muted/30 transition-colors duration-200',
                                )}
                              >
                                <div className="p-3">
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={cn(
                                        'flex-shrink-0 rounded-full p-2 flex items-center justify-center w-8 h-8',
                                        importanceColor[notification.importance].background,
                                        importanceColor[notification.importance].text,
                                      )}
                                    >
                                      <Bell className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="line-clamp-2 leading-snug">
                                        {notification.content}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                                        <span>
                                          {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                                        </span>
                                        <span className="text-muted-foreground/40">•</span>
                                        <span>
                                          {format(new Date(notification.createdAt), 'HH:mm')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                      <div className="py-4 border-t">
                        <Pagination className="flex justify-center">
                          <PaginationContent className="flex flex-wrap justify-center gap-1">
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className={cn(
                                  'cursor-pointer',
                                  currentPage === 1 && 'pointer-events-none opacity-50',
                                )}
                              />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                className={cn(
                                  'cursor-pointer',
                                  currentPage === totalPages && 'pointer-events-none opacity-50',
                                )}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
