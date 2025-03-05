import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export const CurrentCourseCard = () => {
  return (
    <Card className="w-full h-auto flex flex-col pb-0 self-start">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-medium">
            En cours
          </Badge>
          <div className="text-sm text-muted-foreground">4/10 modules</div>
        </div>
        <CardTitle className="mt-2">Développement Web Avancé</CardTitle>
        <CardDescription>
          Maîtrisez les frameworks modernes et les meilleures pratiques
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression</span>
              <span className="font-medium">40%</span>
            </div>
            <Progress value={40} className="h-2" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              className="size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Environ 5 heures restantes</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-0">
        <Button variant="outline" className="m-4">
          Voir le détail
        </Button>
        <Button className="m-4">Continuer</Button>
      </CardFooter>
    </Card>
  )
}
