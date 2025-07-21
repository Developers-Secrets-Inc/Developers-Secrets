'use client' // Le Provider et le Hook sont destinés au client

import React, { createContext, useContext, ReactNode } from 'react'
import type { CoursePart } from '@/payload-types' // Assure-toi que ce chemin est correct

// 1. Définir le type de la valeur du contexte
// Il contiendra l'objet CoursePart complet, ou null initialement.
type CoursePartContextType = CoursePart | null

// 2. Créer le Contexte avec une valeur par défaut (null)
const CoursePartContext = createContext<CoursePartContextType>(null)

// 3. Créer le Provider Component
interface CoursePartProviderProps {
  children: ReactNode
  part: CoursePart // Le provider reçoit la 'part' récupérée côté serveur
}

export const CoursePartProvider = ({ children, part }: CoursePartProviderProps) => {
  // La valeur fournie par le contexte est simplement l'objet 'part'
  return <CoursePartContext.Provider value={part}>{children}</CoursePartContext.Provider>
}

// 4. Créer le Hook personnalisé pour consommer le contexte
export const useCoursePart = (): CoursePart => {
  const context = useContext(CoursePartContext)

  // Vérification pour s'assurer que le hook est utilisé dans un Provider
  if (context === null) {
    throw new Error('useCoursePart must be used within a CoursePartProvider')
  }

  return context
}
