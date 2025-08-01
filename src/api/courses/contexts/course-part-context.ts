'use client'

import { createContext, useContext } from 'react'
import { CoursePartContextType } from './types'

export const CoursePartContext = createContext<CoursePartContextType | null>(null)

export const useCoursePart = () => {
  const context = useContext(CoursePartContext)

  if (!context) {
    throw new Error('useCoursePart must be used within a ChallengeProvider')
  }

  return context
}
