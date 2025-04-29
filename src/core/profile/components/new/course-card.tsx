import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface CourseCardProps {
  title: string
  // Replace with actual course slug or ID for linking
  href: string
  // Optional thumbnail
  thumbnailUrl?: string
}

export const CourseCard = ({ title, href, thumbnailUrl }: CourseCardProps) => {
  return (
    <Link href={href} className="block hover:shadow-md transition-shadow duration-200 rounded-lg">
      <Card className="overflow-hidden h-full flex flex-col">
        {' '}
        {/* Ensure card takes full height if in grid */}
        <CardHeader className="p-0 relative h-24">
          {' '}
          {/* Fixed height for image area */}
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={title} layout="fill" objectFit="cover" />
          ) : (
            <div className="h-full bg-muted flex items-center justify-center text-muted-foreground text-xs p-1">
              No Image
            </div>
          )}
        </CardHeader>
        <CardContent className="p-2 flex-grow">
          {' '}
          {/* Allow content to grow */}
          <CardTitle className="text-sm font-medium line-clamp-2">{title}</CardTitle>
        </CardContent>
        <CardFooter className="p-2 pt-0 mt-auto">
          {' '}
          {/* Push footer to bottom */}
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle size={12} className="mr-1" />
            <span>Completed</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
