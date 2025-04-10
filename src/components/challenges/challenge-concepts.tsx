import { Badge } from '@/components/ui/badge'

const Concept = ({ name }: { name: string }) => {
  return (
    <Badge variant="outline" className="rounded-sm">
      {name}
    </Badge>
  )
}

export const Concepts = ({ concepts }: { concepts: string[] }) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {concepts.map((concept, index) => (
        <Concept key={index} name={concept} />
      ))}
    </div>
  )
}
