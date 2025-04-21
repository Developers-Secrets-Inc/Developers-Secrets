import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { ActiveEffect as ActiveEffectType } from '@/payload-types'

// --- Presentational Component ---

interface ActiveEffectDisplayProps {
  activeEffect: ActiveEffectType
  passiveMultiplier: number
}

// Format time left (no change needed)
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

// Format effect (accepts combined multiplier)
function formatEffect(type: string, combinedMultiplier: number): string {
  const totalBonusPercentage = ((combinedMultiplier - 1) * 100).toFixed(0)
  if (combinedMultiplier <= 1) return '' // Avoid showing +0%

  switch (type) {
    case 'xpBoost':
      return `+${totalBonusPercentage}% XP`
    case 'currencyBoost':
      return `+${totalBonusPercentage}% Gold`
    default:
      const formattedType = type
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
      return `+${totalBonusPercentage}% ${formattedType}`
  }
}

export function ActiveEffectDisplay({ activeEffect, passiveMultiplier }: ActiveEffectDisplayProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  // useEffect for updating timeLeft
  useEffect(() => {
    // Effect now needs to handle potential null activeEffect initially
    if (activeEffect?.expiresAt) {
      setTimeLeft(formatTimeLeft(activeEffect.expiresAt))
      const timerInterval = setInterval(() => {
        // Check inside interval as well
        if (activeEffect?.expiresAt) {
          setTimeLeft(formatTimeLeft(activeEffect.expiresAt))
        } else {
          clearInterval(timerInterval)
        }
      }, 1000)
      // Cleanup function for the interval
      return () => clearInterval(timerInterval)
    } else {
      // If no activeEffect, ensure timeLeft is cleared
      setTimeLeft('')
    }
    // Add passiveMultiplier to dependency array if its change should reset the timer/display,
    // although likely only activeEffect change matters for the timer.
  }, [activeEffect])

  // Return null if activeEffect is not provided
  if (!activeEffect) {
    return null
  }

  // Ensure passiveMultiplier is a valid number, default to 1 if not
  const validPassiveMultiplier =
    typeof passiveMultiplier === 'number' && !isNaN(passiveMultiplier) ? passiveMultiplier : 1

  // Calculate combined multiplier (now safe because we checked activeEffect above)
  const combinedMultiplier = 1 + (activeEffect.multiplier - 1) + (validPassiveMultiplier - 1)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        variant="outline"
        className="bg-primary/5 border-primary/10 hover:bg-primary/5 hover:border-primary/20"
      >
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="font-medium text-primary">
              {formatEffect(activeEffect.effectType, combinedMultiplier)}
            </span>
          </span>
          <span className="text-primary/80">{timeLeft}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
