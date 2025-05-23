import { useId, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Code, Brush, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { cn } from '@/lib/utils'
import { CodingLevelSelect } from './coding-level-select'
import { TimeCodingSelect } from './time-coding-select'
import { CodingLevel, TimeCoding } from '@/core/onboarding/types'
import { SkipOnboardingButton } from './skip-onboarding-button'

interface CurrentLevelCardProps {
  currentStep: number
  userId: string
}

const CurrentLevelSelects = ({ userId }: { userId: string }) => {
  return (
    <>
      <div className="*:not-first:mt-2">
        <Label>What do you think is your current coding level?</Label>
        <CodingLevelSelect userId={userId} />
      </div>

      <div className="*:not-first:mt-2">
        <Label>For how long have you been coding?</Label>
        <TimeCodingSelect userId={userId} />
      </div>
    </>
  )
}

export const CurrentLevelCard = ({ currentStep, userId }: CurrentLevelCardProps) => {
  return (
    <Card className={cn('relative w-md pt-0 overflow-hidden')}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/home" passHref>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 size-6 text-muted-foreground"
              >
                <XIcon className="size-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContentCustom sideOffset={5}>Skip Onboarding</TooltipContentCustom>
        </Tooltip>
      </TooltipProvider>

      <CardHeader className="relative flex flex-col items-start">
        <div className="relative mb-4">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-22 h-22 rounded-full border border-gray-200/40 opacity-20" />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-32 h-32 rounded-full border border-gray-200/40 opacity-15" />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-42 h-42 rounded-full border border-gray-200/40 opacity-10" />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-52 h-52 rounded-full border border-gray-200/40 opacity-5" />
          </div>
          <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center shrink-0 bg-background relative z-10">
            <Code className="size-5 text-primary" />
          </div>
        </div>
        <CardTitle>Select your current level and experience</CardTitle>
        <p className="text-muted-foreground text-sm mt-1">
          Please select your current coding proficiency and how long you&apos;ve been coding.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <CurrentLevelSelects userId={userId} />
      </CardContent>

      <CardFooter className="flex w-full gap-2 border-t pt-4 px-4">
        <div className="flex-1">
          <SkipOnboardingButton />
        </div>
        <Link href={`/auth/onboarding?step=${currentStep + 1}`} passHref className="flex-1">
          <Button className="w-full">Next Step</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
