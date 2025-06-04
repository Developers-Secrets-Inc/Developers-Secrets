'use client'

import { ShieldAlert } from 'lucide-react'

export const DivisionLeaderboard = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <ShieldAlert className="h-10 w-10 text-muted-foreground" />
      <div className="text-center">
        <p className="text-lg font-semibold">Division Leaderboard system is coming soon!</p>
        <p className="text-muted-foreground text-sm mt-2">
          Stay tuned for weekly competitive rankings and rewards by division.
        </p>
      </div>
    </div>
  )
}
