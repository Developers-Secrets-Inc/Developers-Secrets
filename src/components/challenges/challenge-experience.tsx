import { Badge } from '@/components/ui/badge'


export const Experience = ({ quantity }: { quantity: number }) => {
  return (
    <Badge
      variant="outline"
      className="bg-green-500/10 text-green-500 border-green-500/20 rounded-sm"
    >
      +{quantity} XP
    </Badge>
  )
}
