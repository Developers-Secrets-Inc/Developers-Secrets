import { useEffect, useState } from 'react'
import { getActiveEffects } from '@/core/gamification/effects'
import { getSessionUser } from '@/core/user'
import { Sparkles } from 'lucide-react'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'

interface ActiveEffect {
  effectType: string
  multiplier: number
  expiresAt: string
}

function formatTimeLeft(expiresAt: string): string {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diff = expiry.getTime() - now.getTime()

  if (diff <= 0) return 'Expired'

  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}min`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`
}

function formatEffect(type: string, multiplier: number): string {
  const percentage = ((multiplier - 1) * 100).toFixed(0)
  switch (type) {
    case 'xpBoost':
      return `+${percentage}% XP`
    case 'currencyBoost':
      return `+${percentage}% Gold`
    default:
      return type
  }
}

export function ActiveEffectDisplay() {
  const [effect, setEffect] = useState<ActiveEffect | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    async function fetchActiveEffects() {
      const userResult = await getSessionUser()
      if (userResult.success) {
        const effects = await getActiveEffects(userResult.value.id)
        if (effects.length > 0) {
          setEffect(effects[0])
        } else {
          setEffect(null)
        }
      }
    }

    fetchActiveEffects()
    const interval = setInterval(fetchActiveEffects, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (effect) {
      setTimeLeft(formatTimeLeft(effect.expiresAt))

      const interval = setInterval(() => {
        setTimeLeft(formatTimeLeft(effect.expiresAt))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [effect])

  if (!effect) return null

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        variant="outline"
        className="bg-primary/5 border-primary/10 hover:bg-primary/5 hover:border-primary/20"
      >
        <button className="flex w-full items-center justify-between bg-primary/5 border-primary/10">
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="font-medium text-primary">
              {formatEffect(effect.effectType, effect.multiplier)}
            </span>
          </span>
          <span className="text-primary/80">{timeLeft}</span>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
