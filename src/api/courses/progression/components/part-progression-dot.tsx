import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import Link from 'next/link'
import { PartProgressionDotProps } from '../types'

const getPartStyle = (part: PartProgressionDotProps['part'], currentPartSlug: string) => {
  const isCurrent = part.slug === currentPartSlug
  let styles = cn(
    'w-2.5 h-2.5 rounded-full border transition-colors cursor-pointer',
    isCurrent ? 'scale-110' : '',
  )

  switch (part.completionStatus) {
    case 'completed':
      styles = cn(styles, 'bg-green-500/30 border border-green-500/40 hover:bg-green-500/40')
      break
    case 'in_progress':
      styles = cn(styles, 'bg-amber-500/30 border border-amber-500/40 hover:bg-amber-500/40')
      break
    case 'not_started':
    default:
      styles = cn(styles, 'bg-muted border-border hover:bg-muted-foreground/20')
      break
  }

  return styles
}

export const PartProgressionDot = ({
  part,
  currentPartSlug,
  courseSlug,
  chapterSlug,
}: PartProgressionDotProps) => {
  return (
    <TooltipProvider delayDuration={100} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/courses/${courseSlug}/${chapterSlug}/${part.slug}/description`}>
            <div className={getPartStyle(part, currentPartSlug)} />
          </Link>
        </TooltipTrigger>
        <TooltipContentCustom side="top">
          <p>{part.name}</p>
        </TooltipContentCustom>
      </Tooltip>
    </TooltipProvider>
  )
}
