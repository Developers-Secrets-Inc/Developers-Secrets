import { InfinityIcon, Sparkles } from 'lucide-react'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'

// --- Presentational Component --- 

interface PassiveBoostDisplayProps {
  multiplier: number;
}

// Format passive effect (no change needed)
function formatPassiveEffect(multiplier: number): string {
  if (multiplier <= 1) return '' 
  const percentage = ((multiplier - 1) * 100).toFixed(0)
  return `+${percentage}% XP`
}

export function PassiveBoostDisplay({ multiplier }: PassiveBoostDisplayProps) {
  // No internal state or useEffect needed anymore

  // Parent component (`HomeSidebar`) now decides if this should render,
  // so we don't need the `if (multiplier <= 1)` check here.

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        variant="outline"
        className="bg-primary/5 border-primary/10 hover:bg-primary/5 hover:border-primary/20 cursor-default"
      >
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="font-medium text-primary">
              {formatPassiveEffect(multiplier)}
            </span>
          </span>
          <InfinityIcon className="size-4 text-primary/80" />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
