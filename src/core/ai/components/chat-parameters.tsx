'use client'

import { PearlViewMode } from '@/core/challenges/stores/challenge-ui-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LayoutPanelTop, LayoutPanelLeft, RotateCcw, MoreVertical, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const MODES: Array<{
  value: PearlViewMode
  label: string
  icon: React.ReactNode
}> = [
  {
    value: 'inline',
    label: 'Inline',
    icon: <LayoutPanelTop className="w-4 h-4" />,
  },
  {
    value: 'sheet',
    label: 'Sheet',
    icon: <LayoutPanelLeft className="w-4 h-4" />,
  },
]

interface ChatParametersProps {
  viewMode: PearlViewMode
  onViewModeChange: (mode: PearlViewMode) => void
  onResetChat: () => Promise<void>
}

export function ChatParameters({ viewMode, onViewModeChange, onResetChat }: ChatParametersProps) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleConfirmReset = async () => {
    setIsResetting(true)
    try {
      await onResetChat()
    } finally {
      setIsResetting(false)
      setIsResetDialogOpen(false)
    }
  }

  return (
    <>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {MODES.map((mode) => (
                <DropdownMenuItem
                  key={mode.value}
                  onSelect={() => onViewModeChange(mode.value)}
                  className={viewMode === mode.value ? 'font-semibold bg-muted ' : ''}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onSelect={() => setIsResetDialogOpen(true)}
                className="text-red-500 flex gap-2"
              >
                <RotateCcw className="w-4 h-4 text-red-500" />
                <span>Reset Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipPrimitive.Trigger>
        <TooltipContentCustom side="bottom">Chat parameters</TooltipContentCustom>
      </TooltipPrimitive.Root>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your conversation history with Pearl for this challenge.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset} disabled={isResetting}>
              {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
