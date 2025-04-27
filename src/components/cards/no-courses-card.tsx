import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleHelp } from 'lucide-react' // Or another suitable icon

export const NoCoursesCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto my-8 text-center">
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-2">
          <CircleHelp className="w-10 h-10 text-muted-foreground" />
          <span>No Courses Found</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          It seems there are no courses available right now.
          <br />
          Please check back later or explore other areas of the platform.
        </p>
        {/* Optional: Add a button here if needed */}
        {/* <Button variant="outline" className="mt-4">Explore Challenges</Button> */}
      </CardContent>
    </Card>
  )
}
