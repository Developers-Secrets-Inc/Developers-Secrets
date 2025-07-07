'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { cn } from '@/lib/utils'
import { Bot, InfinityIcon } from 'lucide-react'
import React from 'react'
import { useAIQuota } from '../hooks/use-ai-quota'

export const QuotaBadge = () => {
  const { remaining, role, isLoading } = useAIQuota()

  console.log(role, remaining)

  if (isLoading) {
    return <Badge className="bg-muted text-muted-foreground animate-pulse">Loading...</Badge>
  }

  const isUnlimited = role && role !== 'basic'
  const hasMessages = typeof remaining === 'number' && remaining > 5
  const fewMessages = typeof remaining === 'number' && remaining > 0 && remaining <= 5
  const noMessages = typeof remaining === 'number' && remaining <= 0

  const getStyle = () => {
    if (isUnlimited) return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    if (hasMessages) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    if (fewMessages) return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    if (noMessages) return 'bg-red-500/10 text-red-500 border-red-500/20'
    return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }

  const getIcon = () => {
    if (isUnlimited) return <InfinityIcon className="h-3.5 w-3.5" />
    return <Bot className="h-3.5 w-3.5" />
  }

  const getText = () => {
    if (isUnlimited) return 'Unlimited'
    if (hasMessages || fewMessages) return `${remaining} messages left`
    return 'No messages'
  }

  const getTooltipText = () => {
    if (isUnlimited) return 'You have unlimited messages with Pearl.'
    if (hasMessages || fewMessages)
      return `You have ${remaining} messages remaining with Pearl today.`
    return 'You have used all your messages for today.'
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn('gap-1.5 font-semibold cursor-pointer', getStyle())}
          >
            {getIcon()}
            <span>{getText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContentCustom>
          <p>{getTooltipText()}</p>
        </TooltipContentCustom>
      </Tooltip>
    </TooltipProvider>
  )
}
