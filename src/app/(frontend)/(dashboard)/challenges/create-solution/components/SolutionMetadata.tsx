'use client'

import { Input } from '@/components/ui/input'
import { useSolutionFormStore } from '../store/solution-form-store'
import { AlertTriangle } from 'lucide-react'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { TooltipProvider, Tooltip, TooltipTrigger } from '@radix-ui/react-tooltip'

const TITLE_MAX_LENGTH = 50
const DESCRIPTION_MAX_LENGTH = 150

const UserSolutionTitle = () => {
  const title = useSolutionFormStore((state) => state.title)
  const setTitle = useSolutionFormStore((state) => state.setTitle)
  const isLimitReached = title.length >= TITLE_MAX_LENGTH
  
  return (
    <div className="relative flex items-center">
    <Input
      id="title"
      placeholder="Untitled Solution..."
      value={title}
      onChange={(e) => setTitle(e.target.value)}
        maxLength={TITLE_MAX_LENGTH}
        className="text-2xl lg:text-3xl font-semibold border-none shadow-none focus-visible:ring-0 px-0 h-14 pt-2 bg-transparent flex-grow"
      aria-label="Title"
      aria-required="true"
    />
      {isLimitReached && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle className="w-5 h-5 text-yellow-500 ml-2 shrink-0" />
            </TooltipTrigger>
            <TooltipContentCustom side="top">
              <p>Character limit of {TITLE_MAX_LENGTH} reached.</p>
            </TooltipContentCustom>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

const UserSolutionDescription = () => {
  const description = useSolutionFormStore((state) => state.description)
  const setDescription = useSolutionFormStore((state) => state.setDescription)
  const isLimitReached = description.length >= DESCRIPTION_MAX_LENGTH

  return (
    <div className="relative flex items-center">
    <Input
      id="description"
      placeholder="Add a short description..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
        maxLength={DESCRIPTION_MAX_LENGTH}
        className="border-none shadow-none focus-visible:ring-0 px-0 h-auto py-1 bg-transparent text-sm text-muted-foreground flex-grow"
      aria-label="Description"
      aria-required="true"
    />
      {isLimitReached && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle className="w-4 h-4 text-yellow-500 ml-2 shrink-0" />
            </TooltipTrigger>
            <TooltipContentCustom side="top">
              <p>Character limit of {DESCRIPTION_MAX_LENGTH} reached.</p>
            </TooltipContentCustom>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

export default function SolutionMetadata() {
  return (
    <div className="space-y-2">
      <UserSolutionTitle />
      <UserSolutionDescription />
    </div>
  )
}
