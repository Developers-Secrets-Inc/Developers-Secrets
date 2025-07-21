import { Eye, ThumbsDown, ThumbsUp } from 'lucide-react'

// Updated props to be required
interface SolutionStatsProps {
  views: number
  likes: number
  dislikes: number
}

const StatItem = ({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: number
  label: string
}) => (
  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <Icon className="w-4 h-4" />
    <span className="font-medium">{value}</span>
    <span>{label}</span>
  </div>
)

// Remove default values as props are now required
export default function SolutionStats({ views, likes, dislikes }: SolutionStatsProps) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card space-y-3">
      <h3 className="text-sm font-medium text-foreground mb-3 border-b pb-2">Statistics</h3>
      <StatItem icon={Eye} value={views} label="Views" />
      <StatItem icon={ThumbsUp} value={likes} label="Likes" />
      <StatItem icon={ThumbsDown} value={dislikes} label="Dislikes" />
    </div>
  )
}
