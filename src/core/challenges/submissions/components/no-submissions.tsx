import { History } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NoSubmissions() {
  return (
    <Card className="mt-4 mb-6 border-dashed border">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <History className="h-5 w-5" />
          No Submissions Yet
        </CardTitle>
        <CardDescription className="text-center pt-1">
          You haven&apos;t submitted any solutions to this challenge yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pb-6">
        <p className="text-sm text-muted-foreground">
          Submit your first solution to start tracking your progress!
        </p>
      </CardContent>
    </Card>
  )
}
