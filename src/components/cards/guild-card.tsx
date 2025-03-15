import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const GuildCard = () => {
  return (
    <Card className="w-full h-auto flex flex-col pb-0 self-start">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Guilde des Développeurs</CardTitle>
          <Badge variant="outline" className="text-xs">
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            24 membres
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Notifications */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Notifications</h4>
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">3 nouvelles</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user-03.png" alt="User avatar" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">
                    Marie L. a terminé le challenge "API Authentication"
                  </p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user-05.png" alt="User avatar" />
                  <AvatarFallback>SB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">Sophie B. a rejoint la guilde</p>
                  <p className="text-xs text-muted-foreground">Il y a 5 heures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="size-4 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium">Nouveau défi de guilde disponible</p>
                  <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Messages récents</h4>
              <Badge variant="outline" className="text-xs">
                2 non lus
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user-02.png" alt="User avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">Jean D.</p>
                    <p className="text-xs text-muted-foreground">10:42</p>
                  </div>
                  <p className="text-xs truncate">
                    Est-ce que quelqu'un peut m'aider avec le défi de sécurité ?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user-04.png" alt="User avatar" />
                  <AvatarFallback>PT</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">Pierre T.</p>
                    <p className="text-xs text-muted-foreground">Hier</p>
                  </div>
                  <p className="text-xs truncate">Félicitations pour ton niveau 24 ! 🎉</p>
                </div>
              </div>
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
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
          </svg>
          Activités
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Messages
        </Button>
      </CardFooter>
    </Card>
  )
}
