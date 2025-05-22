import { LinkButton } from '@/components/common/link-button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Brush, Code } from 'lucide-react'
import { useId } from 'react'

interface CurrentLevelCardProps {
  currentStep: number
}

const CodingExperienceSelect = () => {
  const codingSelectId = useId()

  return (
    <Select>
      <SelectTrigger
        id={codingSelectId}
        className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
      >
        <SelectValue placeholder="Select your coding level" />
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
        <SelectItem value="beginner">
          <Code size={16} aria-hidden="true" />
          <span className="truncate">Beginner</span>
        </SelectItem>
        <SelectItem value="intermediate">
          <Code size={16} aria-hidden="true" />
          <span className="truncate">Intermediate</span>
        </SelectItem>
        <SelectItem value="advanced">
          <Code size={16} aria-hidden="true" />
          <span className="truncate">Advanced</span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

const TimeCodingSelect = () => {
  const timeCodingSelectId = useId()

  return (
    <Select>
      <SelectTrigger
        id={timeCodingSelectId}
        className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
      >
        <SelectValue placeholder="Select time since coding" />
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
        <SelectItem value="less-than-6-months">
          <Brush size={16} aria-hidden="true" />
          <span className="truncate">-6 months</span>
        </SelectItem>
        <SelectItem value="less-than-1-year">
          <Brush size={16} aria-hidden="true" />
          <span className="truncate">-1 year</span>
        </SelectItem>
        <SelectItem value="1-2-years">
          <Brush size={16} aria-hidden="true" />
          <span className="truncate">1-2 years</span>
        </SelectItem>
        <SelectItem value="3-5-years">
          <Brush size={16} aria-hidden="true" />
          <span className="truncate">3-5 years</span>
        </SelectItem>
        <SelectItem value="more-than-5-years">
          <Brush size={16} aria-hidden="true" />
          <span className="truncate">+5 years</span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

const CurrentLevelSelects = () => {
  return (
    <>
      <div className="*:not-first:mt-2">
        <Label>Coding Level</Label>
        <CodingExperienceSelect />
      </div>

      <div className="*:not-first:mt-2">
        <Label>Time since coding</Label>
        <TimeCodingSelect />
      </div>
    </>
  )
}



const CurrentLevelNavigation = ({ currentStep }: CurrentLevelCardProps) => {
  return (
    <div className="flex w-full gap-2">
      <LinkButton variant="outline" href="/home">
        Skip Onboarding
      </LinkButton>
      <LinkButton href={`/auth/onboarding?step=${currentStep + 1}`}>Next</LinkButton>
    </div>
  )
}

export const CurrentLevelCard = ({ currentStep }: CurrentLevelCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select your current level and experience</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <CurrentLevelSelects />
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        <CurrentLevelNavigation currentStep={currentStep} />
      </CardFooter>
    </Card>
  )
}
