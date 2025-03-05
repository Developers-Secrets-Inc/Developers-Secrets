import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const LeaderboardCard = () => {
  return (
    <Card className="w-full h-auto flex flex-col pb-0 self-start">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Classement Division Gold</CardTitle>
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
            <svg
              className="mr-1 size-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            Gold
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Top 3 */}
          <div className="flex justify-between items-end mb-6">
            {/* 2nd place */}
            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12 border-2 border-gray-300">
                <AvatarImage src="/avatars/user-02.png" alt="User avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="mt-2 text-center">
                <div className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mb-1">
                  2
                </div>
                <p className="text-xs font-medium">Jean D.</p>
                <p className="text-xs text-muted-foreground">2780 pts</p>
              </div>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16 border-2 border-amber-500">
                <AvatarImage src="/avatars/user-03.png" alt="User avatar" />
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
              <div className="mt-2 text-center">
                <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mb-1">
                  1
                </div>
                <p className="text-xs font-medium">Marie L.</p>
                <p className="text-xs text-muted-foreground">3120 pts</p>
              </div>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12 border-2 border-amber-700">
                <AvatarImage src="/avatars/user-04.png" alt="User avatar" />
                <AvatarFallback>PT</AvatarFallback>
              </Avatar>
              <div className="mt-2 text-center">
                <div className="bg-amber-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mb-1">
                  3
                </div>
                <p className="text-xs font-medium">Pierre T.</p>
                <p className="text-xs text-muted-foreground">2650 pts</p>
              </div>
            </div>
          </div>

          {/* Your position */}
          <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                7
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user-01.png" alt="User avatar" />
                <AvatarFallback>DV</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Vous</p>
                <p className="text-xs text-muted-foreground">2450 pts</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+120 pts</span> cette semaine
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-0">
        <Button variant="ghost" className="m-4">
          <svg
            className="mr-2 size-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h10" />
            <path d="M7 12h10" />
            <path d="M7 17h10" />
          </svg>
          Classement complet
        </Button>
        <Button variant="ghost" className="m-4">
          <svg
            className="mr-2 size-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20v-6" />
            <path d="M18 20V10" />
            <path d="M6 20v-3" />
            <path d="M18 4l3 3-3 3" />
            <path d="M18 10l-3-3 3-3" />
          </svg>
          Statistiques
        </Button>
      </CardFooter>
    </Card>
  )
}
