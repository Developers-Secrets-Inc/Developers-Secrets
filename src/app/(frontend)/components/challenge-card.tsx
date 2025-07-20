import { cn } from '@/lib/utils'
import { Sparkles, CheckCircle2Icon, CircleDotIcon } from 'lucide-react'
import { Markdown } from '@/components/markdown'

interface DisplayCardProps {
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  date?: string
  iconClassName?: string
  titleClassName?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  status?: 'in_progress' | 'completed' | undefined
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4" />,
  title = 'Featured',
  description = 'Discover amazing content',
  date = 'Just now',
  iconClassName = '',
  titleClassName = '',
  difficulty,
  status,
}: DisplayCardProps) {
  let badge
  if (difficulty === 'easy') {
    badge = (
      <span className="absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
        Easy
      </span>
    )
  } else if (difficulty === 'medium') {
    badge = (
      <span className="absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-500">
        Medium
      </span>
    )
  } else if (difficulty === 'hard') {
    badge = (
      <span className="absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500">
        Hard
      </span>
    )
  }
  return (
    <div
      className={cn(
        "relative flex w-[22rem] select-none flex-col justify-between rounded-md border border-border bg-background backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:content-[''] hover:bg-background/90 [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className,
      )}
    >
      {badge}
      <div>
        <p className="text-lg font-medium">{title}</p>
      </div>
      <Markdown className="text-sm text-muted-foreground flex-col">{description}</Markdown>
      <p className="text-sm text-muted-foreground">{date}</p>
      {/* Icone de progression en bas à droite */}
      {status && (
        <span className="absolute bottom-2 right-2">
          {status === 'in_progress' ? (
            <CircleDotIcon className="h-5 w-5 text-amber-500" />
          ) : status === 'completed' ? (
            <CheckCircle2Icon className="h-5 w-5 text-emerald-500" />
          ) : null}
        </span>
      )}
    </div>
  )
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[]
  align?: 'left' | 'center'
}

export function DisplayCards({ cards, align = 'center' }: DisplayCardsProps) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: '[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10',
    },
  ]

  const displayCards = cards || defaultCards

  return (
    <div
      className={cn(
        "grid [grid-template-areas:'stack'] opacity-100 animate-in fade-in-0 duration-700",
        align === 'left' ? 'place-items-start' : 'place-items-center',
      )}
    >
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  )
}
