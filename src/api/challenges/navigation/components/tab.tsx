import { Lock, LucideIcon } from 'lucide-react'
import Link from 'next/link'

type TabProps = {
  label: string
  icon: LucideIcon
  href: string
  active?: boolean
  locked?: boolean
  onClick?: () => void
}

export function Tab({ label, icon: Icon, href, active, locked, onClick }: TabProps) {
  const className = [
    'flex flex-1 items-center justify-center text-base gap-1.5 h-full px-4 transition-colors',
    active ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-accent',
    locked ? 'opacity-50' : '',
  ].join(' ')

  const IconToRender = locked ? Lock : Icon

  const content = (
    <>
      <IconToRender size={16} className="me-1.5 opacity-60" aria-hidden="true" />
      <span className='truncate'>{label}</span>
    </>
  )

  if (locked) {
    return (
      <button onClick={onClick} className={className} aria-disabled={locked}>
        {content}
      </button>
    )
  }

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      tabIndex={locked ? -1 : 0}
      aria-disabled={locked}
      className={className}
    >
      {content}
    </Link>
  )
}
