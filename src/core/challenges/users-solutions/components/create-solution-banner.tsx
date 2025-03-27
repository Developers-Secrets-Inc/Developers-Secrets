import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Share } from 'lucide-react'
import Link from 'next/link'

interface CreateSolutionBannerProps {
  challengeId: number
}

export function CreateSolutionBanner({ challengeId }: CreateSolutionBannerProps) {
  return (
    <Card className="mb-6 border border-dashed py-2">
      <CardContent className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-1.5">
            <Share className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Share Your Solution</h3>
            <p className="text-xs text-muted-foreground">
              Help others learn by sharing your approach
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="flex items-center gap-2">
          <Link href={`/challenges/create-solution?challenge_id=${challengeId}`}>
            <PlusCircle className="h-3.5 w-3.5" />
            Create Solution
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
