import { Challenge } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const difficultyLabels: Record<string, string> = {
  very_easy: 'Très Facile',
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  horrible: 'Horrible',
}

const difficultyStyles: Record<string, string> = {
  very_easy: 'bg-cyan-500/10 text-cyan-500',
  easy: 'bg-emerald-500/10 text-emerald-500',
  medium: 'bg-amber-500/10 text-amber-500',
  hard: 'bg-red-500/10 text-red-500',
  horrible: 'bg-purple-500/10 text-purple-500',
}

export const ChallengesTable = ({ challenges }: { challenges: Challenge[] }) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Titre</TableHead>
            <TableHead>Difficulté</TableHead>
            <TableHead className="text-right">Expérience</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challenges.map((challenge) => (
            <TableRow key={challenge.id}>
              <TableCell className="font-medium">{challenge.title}</TableCell>
              <TableCell>
                <Badge 
                  className={difficultyStyles[challenge.difficulty] || 'bg-gray-500/10 text-gray-500'} 
                  variant="secondary"
                >
                  {difficultyLabels[challenge.difficulty] || challenge.difficulty}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{challenge.baseExperience} XP</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {challenges.length === 0 && (
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Aucun challenge trouvé
        </p>
      )}
    </div>
  )
}
