'use client'

import { Button } from '@/components/ui/button'

const isDevelopment = process.env.NODE_ENV === 'development'

interface DevToolsProps {
  onExperienceGain: (amount: number) => void
}

export function DevTools({ onExperienceGain }: DevToolsProps) {
  if (!isDevelopment) return null

  return (
    <div className="flex flex-col gap-2 pt-4 border-t">
      <p className="text-xs text-muted-foreground">Development Tools</p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onExperienceGain(50)}>
          +50 XP
        </Button>
        <Button size="sm" variant="outline" onClick={() => onExperienceGain(150)}>
          +150 XP
        </Button>
        <Button size="sm" variant="outline" onClick={() => onExperienceGain(500)}>
          +500 XP
        </Button>
      </div>
    </div>
  )
}
