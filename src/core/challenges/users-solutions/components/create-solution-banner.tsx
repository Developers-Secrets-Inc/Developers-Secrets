import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Share } from 'lucide-react'
import Link from 'next/link'
import { hasUserSolution } from '../index'

interface CreateSolutionBannerProps {
  challengeId: number
  userId: string
}

export async function CreateSolutionBanner({ challengeId, userId }: CreateSolutionBannerProps) {
  const hasSolution = await hasUserSolution(challengeId, userId)

  return (
    <Card className="mb-6 border border-dashed py-2">
      <CardContent className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-1.5">
            <Share className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">
              {hasSolution ? 'You Already Have a Solution' : 'Share Your Solution'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {hasSolution
                ? 'You can update your solution to help others learn'
                : 'Help others learn by sharing your approach'}
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="flex items-center gap-2">
          <Link href={`/challenges/create-solution?challenge_id=${challengeId}`}>
            <PlusCircle className="h-3.5 w-3.5" />
            {hasSolution ? 'Update Solution' : 'Create Solution'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
