'use client'
import { Code, Brush, Rocket } from 'lucide-react'
import { useCodingLevel } from '../hooks/use-coding-level'
import { CodingLevel } from '../types'

function getCodingLevelIcon(level: CodingLevel | undefined) {
  switch (level) {
    case 'beginner':
      return <Code className="size-5 text-primary" />
    case 'intermediate':
      return <Brush className="size-5 text-primary" />
    case 'advanced':
      return <Rocket className="size-5 text-primary" />
    default:
      return <Code className="size-5 text-primary" />
  }
}

export const CurrentLevelIcon = ({ userId }: { userId: string }) => {
  const { codingLevel } = useCodingLevel(userId)
  return getCodingLevelIcon(codingLevel)
}
