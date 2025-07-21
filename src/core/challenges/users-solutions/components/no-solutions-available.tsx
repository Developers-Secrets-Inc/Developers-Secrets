import { Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NoSolutionsAvailable() {
  return (
    <Card className="mt-4 mb-6 border-dashed border">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Search className="h-5 w-5" />
          No Solutions Found
        </CardTitle>
        <CardDescription className="text-center pt-1">
          There are currently no community solutions available for this challenge.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pb-6">
        <p className="text-sm text-muted-foreground">
          Be the first to share your solution and help others learn!
        </p>
      </CardContent>
    </Card>
  )
}
