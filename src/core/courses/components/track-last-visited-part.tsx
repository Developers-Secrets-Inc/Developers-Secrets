'use client'

import { useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'

/**
 * Composant client invisible qui enregistre la dernière partie de cours visitée
 * et le slug du cours associé dans le localStorage.
 */
export const TrackLastVisitedPart = () => {
  // useParams ne contient que les slugs de route, on utilise usePathname pour l'URL complète
  const pathname = usePathname()
  // On utilise useParams pour extraire le course_slug facilement
  const params = useParams<{ course_slug: string }>()

  useEffect(() => {
    // Vérifie qu'on est bien sur une page de partie de cours
    // et que le pathname et le course_slug sont valides
    if (pathname && pathname.startsWith('/courses/') && params?.course_slug) {
      try {
        localStorage.setItem('lastVisitedPartUrl', pathname)
        localStorage.setItem('lastVisitedCourseSlug', params.course_slug)
        localStorage.setItem(`lastVisitedTimestamp_${params.course_slug}`, Date.now().toString())
      } catch (error) {
        // Gérer les erreurs potentielles (localStorage indisponible, etc.)
        console.error('Failed to save last visited part to localStorage:', error)
      }
    }
  }, [pathname, params?.course_slug]) // Ré-exécuter si le chemin ou le slug du cours change

  // Ce composant ne rend rien visuellement
  return null
}
