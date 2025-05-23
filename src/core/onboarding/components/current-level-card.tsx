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

interface CurrentLevelCardProps {
  currentStep: number
  userId: string
}

const CurrentLevelSelects = ({ userId }: { userId: string }) => {
  return (
    <>
      <div className="*:not-first:mt-2">
        <Label>Coding Level</Label>
        <CodingLevelSelect userId={userId} />
      </div>

      <div className="*:not-first:mt-2">
        <Label>Time since coding</Label>
        <TimeCodingSelect userId={userId} />
      </div>
    </>
  )
}

export const CurrentLevelCard = ({ currentStep, userId }: CurrentLevelCardProps) => {
  return (
    <Card className={cn('relative w-md')}>
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

      <CardHeader className="flex items-center gap-4">
        <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center">
          <Code className="size-5 text-primary" />
        </div>
        <CardTitle>Select your current level and experience</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <CurrentLevelSelects userId={userId} />
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link href={`/auth/onboarding?step=${currentStep + 1}`} passHref>
          <Button className="w-full">Next Step</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
