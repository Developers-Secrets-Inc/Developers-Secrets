import { Gauge } from '@/components/gauge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Challenge, ChallengeTag } from '@/payload-types'
import { Play, Target, Calendar } from 'lucide-react'
import Link from 'next/link'
import { ChallengeDifficultyBadge } from '../../components/difficulty-badge'
import { ChallengeWithCompletionStatus } from '../../types'

type TagInformationCardProps = {
  tag: ChallengeTag
  challenges: ChallengeWithCompletionStatus[]
}

type DifficultyStats = {
  total: number
  completed: number
  percentage: number
}

const getDifficultyStats = (
  challenges: ChallengeWithCompletionStatus[],
  difficulty: Challenge['difficulty'],
): DifficultyStats => {
  const filteredChallenges = challenges.filter((challenge) => challenge.difficulty === difficulty)
  const completed = filteredChallenges.filter(
    (challenge) => challenge.completionStatus === 'completed',
  ).length
  const total = filteredChallenges.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, completed, percentage }
}

const getRelativeTime = (date: string): string => {
  const now = new Date()
  const updatedDate = new Date(date)
  const diffInMs = now.getTime() - updatedDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'today'
  } else if (diffInDays === 1) {
    return 'yesterday'
  } else {
    return `${diffInDays} days ago`
  }
}

const DifficultyCompletionCard = ({
  difficulty,
  stats,
}: {
  difficulty: Challenge['difficulty']
  stats: DifficultyStats
}) => {
  return (
    <div className="p-2 border rounded-lg">
      <div className="flex items-center justify-between">
        <ChallengeDifficultyBadge difficulty={difficulty} />
        <span className="text-sm text-muted-foreground">
          {stats.completed}/{stats.total}
        </span>
      </div>
    </div>
  )
}

export const TagInformationCard = ({ tag, challenges }: TagInformationCardProps) => {
  const veryEasyStats = getDifficultyStats(challenges, 'very_easy')
  const easyStats = getDifficultyStats(challenges, 'easy')
  const mediumStats = getDifficultyStats(challenges, 'medium')
  const hardStats = getDifficultyStats(challenges, 'hard')

  const totalChallenges = challenges.length
  const completedChallenges = challenges.filter((c) => c.completionStatus === 'completed').length
  const overallPercentage =
    totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0

  // Find first uncompleted challenge
  const firstUncompletedChallenge = challenges.find((c) => c.completionStatus !== 'completed')

  return (
    <Card className="h-fit">
      <CardHeader className="border-b mx-6 px-0 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-4">
            <div className="w-[56px] h-[56px] rounded-[12px] border flex items-center justify-center bg-background">
              <Target className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 mb-2">
                <span className='text-lg'>{tag.name}</span>
                <Badge variant="outline">{totalChallenges} challenges</Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Updated {getRelativeTime(tag.updatedAt)}</span>
              </div>
            </div>
          </div>
          {firstUncompletedChallenge && (
            <Link href={`/challenges/${firstUncompletedChallenge.slug}/description`}>
              <Button variant="outline" size="sm" className='cursor-pointer'>
                <Play className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
        {tag.description && <p className="text-sm text-muted-foreground">{tag.description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex justify-center items-center p-4 border border-border rounded-lg">
            <div className="flex justify-center items-center">
              <Gauge
                size="large"
                value={overallPercentage}
                showValue={true}
                colors={{
                  '0': '#ef4444',
                  '34': '#f59e0b',
                  '68': '#10b981',
                }}
              />
            </div>
          </div>
        
          <div className="space-y-2">
            <DifficultyCompletionCard difficulty="very_easy" stats={veryEasyStats} />
            <DifficultyCompletionCard difficulty="easy" stats={easyStats} />
            <DifficultyCompletionCard difficulty="medium" stats={mediumStats} />
            <DifficultyCompletionCard difficulty="hard" stats={hardStats} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
