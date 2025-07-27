import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import * as Tooltip from '@radix-ui/react-tooltip'
import Link from 'next/link'
import { ChallengesStatusIcons } from '../../components/icons'

type Difficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'horrible'
type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

interface Challenge {
  id: number
  title: string
  slug: string
  difficulty: Difficulty
  baseExperience: number
  status?: CompletionStatus
}

const difficultyStyles: Record<Difficulty, string> = {
  very_easy: 'bg-cyan-500/10 text-cyan-500',
  easy: 'bg-emerald-500/10 text-emerald-500',
  medium: 'bg-amber-500/10 text-amber-500',
  hard: 'bg-red-500/10 text-red-500',
  horrible: 'bg-purple-500/10 text-purple-500',
}





function StatusIcon({ status }: { status: CompletionStatus }) {
  if (status === 'not_started') return null

  return (
    <div className="w-8">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="flex items-center justify-center">
              {status === 'in_progress' ? ChallengesStatusIcons.InProgress : ChallengesStatusIcons.Completed}
            </div>
          </Tooltip.Trigger>
          <TooltipContentCustom sideOffset={2} align="center">
            {status === 'in_progress' ? 'In Progress' : 'Completed'}
          </TooltipContentCustom>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}

function ChallengeRow({ challenge }: { challenge: Challenge }) {
  return (
    <TableRow>
      <TableCell>
        <StatusIcon status={challenge.status || 'not_started'} />
      </TableCell>
      <TableCell>
        <Link href={`/challenges/${challenge.slug}`} className="font-medium hover:underline">
          {challenge.title}
        </Link>
      </TableCell>
      <TableCell>
        <Badge className={cn(difficultyStyles[challenge.difficulty])} variant="secondary">
          {challenge.difficulty === 'very_easy'
            ? 'Very Easy'
            : challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="font-medium">{challenge.baseExperience} XP</span>
      </TableCell>
    </TableRow>
  )
}

function LoadingRow({ id }: { id: number }) {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center text-muted-foreground">
        Loading challenge {id}...
      </TableCell>
    </TableRow>
  )
}
export const ChallengeCategoryTable = ({
  challenges,
}: {
  challenges: Challenge[]
}) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-8"></TableHead>
            <TableHead>Challenge</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Experience</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challenges.map((challenge) => {
            if (typeof challenge === 'number') {
              return <LoadingRow key={challenge} id={challenge} />
            }
            return <ChallengeRow key={challenge.id} challenge={challenge} />
          })}
        </TableBody>
      </Table>
    </div>
  )
}
