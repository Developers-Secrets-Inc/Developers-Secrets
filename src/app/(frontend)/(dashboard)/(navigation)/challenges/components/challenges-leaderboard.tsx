'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'

export const DivisionLeaderboardCard = () => {
  return (
    <Card className="w-full py-0">
      <CardHeader className="flex flex-row items-center justify-between pt-6 px-6">
        <CardTitle className="text-lg font-semibold">Weekly Division Ranking</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <ShieldAlert className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-semibold">Division Leaderboard system is coming soon!</p>
            <p className="text-muted-foreground text-sm mt-2">
              Stay tuned for weekly competitive rankings and rewards by division.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
