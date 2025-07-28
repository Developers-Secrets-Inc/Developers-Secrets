import { AiExercice, Challenge, CoursePart, Exercice } from '@/payload-types'
import React from 'react'

const ClassicChallengeExercice = ({ exercice }: { exercice: Exercice }) => {
  return <div>Classic Exercice Component</div>
}

const AIChallengeExercice = ({ exercice }: { exercice: AiExercice }) => {
  return <div>AI Exercice Component</div>
}

export const PartExercice = ({ exercice }: { exercice: CoursePart['exercice'] }) => {
  if (!exercice) {
    return <div>No exercice available</div>
  }

  const exercicesComponents: Record<string, React.ReactNode> = {
    exercices: (
      <ClassicChallengeExercice
        exercice={
          exercice.relationTo === 'exercices' ? (exercice.value as Exercice) : ({} as Exercice)
        }
      />
    ),
    'ai-exercices': (
      <AIChallengeExercice
        exercice={
          exercice.relationTo === 'ai-exercices'
            ? (exercice.value as AiExercice)
            : ({} as AiExercice)
        }
      />
    ),
  }

  return <div>{exercicesComponents[exercice.relationTo]}</div>
}
