import { Badge } from '@/components/ui/badge'

interface ChallengeConceptsProps {
  concepts: string[]
}

export function ChallengeConcepts({ concepts }: ChallengeConceptsProps) {
  if (!concepts || concepts.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {concepts.map((concept, index) => (
        <Badge
          key={index}
          variant="outline" 
          className="rounded-sm"
        >
          {concept}
        </Badge>
      ))}
    </div>
  )
}
