import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { CodingLevelSelect } from './coding-level-select'
import { CurrentLevelIcon } from './current-level-icon'
import { SkipOnboardingDialog } from './skip-onboarding-button'
import { TimeCodingSelect } from './time-coding-select'

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
      <CardHeader className="relative flex flex-col items-start pt-4">
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
          <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center shrink-0 bg-background relative z-10 shadow-lg">
            <CurrentLevelIcon userId={userId} />
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
          <SkipOnboardingDialog userId={userId}>
            <Button className="w-full" variant="outline">
              Skip Onboarding
            </Button>
          </SkipOnboardingDialog>
        </div>
        <Link href={`/auth/onboarding?step=${currentStep + 1}`} passHref className="flex-1">
          <Button className="w-full">Next Step</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
