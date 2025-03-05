import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { List } from 'lucide-react'

export const ChallengeCard = () => {
  return (
    <Card className="w-full h-auto flex flex-col pb-0 bg-background self-start">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-primary text-primary">
            Challenge
          </Badge>
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
              <path d="M20.2 6 17 2.8a1.1 1.1 0 0 0-.7-.3H7.7a1.1 1.1 0 0 0-.7.3L3.8 6a1.1 1.1 0 0 0-.3.7v9.7c0 .2.1.4.3.6l3.2 3.2c.2.2.4.3.7.3h8.6c.3 0 .5-.1.7-.3l3.2-3.2c.2-.2.3-.4.3-.6V6.7c0-.3-.1-.5-.3-.7z" />
              <path d="M8 12h8" />
              <path d="M8 8h8" />
              <path d="M8 16h8" />
            </svg>
            +250 XP
          </Badge>
        </div>
        <CardTitle className="mt-2">API Authentication Challenge</CardTitle>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            Intermediate
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Backend
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Security
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Implement a secure authentication system with JWT, refresh tokens, and protection against
          CSRF attacks.
        </p>

        {/* XP Boost Badge - Version plus discrète */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg
            className="size-3.5 text-primary/70"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
            <circle cx="17" cy="7" r="5" />
          </svg>
          <span>XP Boost +25% available for 16 more hours</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-0">
        <Button variant="outline" className="m-4">
          <List className="mr-2 size-4" />
          All challenges
        </Button>
        <Button className="m-4">Start Challenge</Button>
      </CardFooter>
    </Card>
  )
}
