'use client'

import React from 'react'
import { toast as sonnerToast } from 'sonner'

type Difficulty = 'easy' | 'medium' | 'hard' | 'horrible'

interface CoursePart {
  name: string
  difficulty: Difficulty
}

function calculateExperience(difficulty: Difficulty): number {
  const difficultyMultipliers = {
    easy: 1,
    medium: 2,
    hard: 3,
    horrible: 4
  }
  return difficultyMultipliers[difficulty] * 50
}

export function toast(coursePart: CoursePart & { solutionAlreadyUnlocked?: boolean }) {
  const experience = calculateExperience(coursePart.difficulty)
  const title = `${coursePart.name} completed!`
  
  let description: string
  if (coursePart.solutionAlreadyUnlocked) {
    description = "Challenge completed! No experience points awarded (solution already unlocked)"
  } else {
    description = `You earned ${experience} experience points`
  }
  
  return sonnerToast.custom((id) => (
    <Toast id={id} title={title} description={description} />
  ))
}

function Toast(props: ToastProps) {
  const { title, description, id } = props

  return (
    <div className="flex rounded-lg bg-background shadow-lg ring-1 ring-border w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

interface ToastProps {
  id: string | number
  title: string
  description: string
}
