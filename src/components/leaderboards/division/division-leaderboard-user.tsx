import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RankedLeaderboardUser } from '@/core/gamification/divisions' // Import the type
import { Medal, Trophy } from 'lucide-react'

interface DivisionLeaderboardUserProps {
  user: RankedLeaderboardUser
  isCurrentUser: boolean
}

const getRankColor = (rank: number): string => {
  if (rank === 1) return 'text-amber-400'
  if (rank === 2) return 'text-slate-400'
  if (rank === 3) return 'text-yellow-700'
  return 'text-muted-foreground'
}

const getRankIcon = (rank: number): React.ReactNode => {
  if (rank === 1) return <Trophy className="size-4" />
  if (rank <= 3) return <Medal className="size-4" />
  return <span className="w-4 text-center">{rank}</span>
}

export const DivisionLeaderboardUser = ({ user, isCurrentUser }: DivisionLeaderboardUserProps) => {
  const rankColor = getRankColor(user.rank)

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-md transition-colors ${isCurrentUser ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex items-center justify-center w-6 font-semibold ${rankColor}`}>
          {getRankIcon(user.rank)}
        </div>
        <Avatar className="size-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium truncate flex-1 min-w-0">
          {user.name} {isCurrentUser && '(You)'}
        </span>
      </div>
      <span className="font-semibold text-sm text-primary">
        {user.weeklyExperience.toLocaleString()} XP
      </span>
    </div>
  )
}
