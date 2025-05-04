// Retirer la directive 'use client'
// 'use client'

import { AuthButtons } from '@/components/buttons/AuthButtons'
// Retirer l'import du Button car il est maintenant dans le composant client
// import { Button } from '@/components/ui/button'
import { Eclipse } from 'lucide-react' // Utiliser PanelLeftOpen ou une autre icône pertinente
import Link from 'next/link'
// Importer le nouveau composant client
import { CourseOutlineSheetTrigger } from './course-outline-sheet-trigger'
// Importer le type correct pour les données de l'outline depuis parts.ts
import type { CourseOutlineUserData } from '@/core/courses/parts'

// Définir les props pour le header avec le type mis à jour
interface CoursePartMainHeaderProps {
  courseOutlineData: CourseOutlineUserData // Utiliser le type importé
  courseSlug: string
}

export const CoursePartMainHeader = ({
  courseOutlineData,
  courseSlug,
}: CoursePartMainHeaderProps) => {
  // Retirer la fonction handleOutlineClick
  // const handleOutlineClick = () => {
  //   console.log('Outline button clicked - Implement logic here')
  //   // Exemple: setSidebarOpen(!sidebarOpen)
  // }

  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-4 border-b px-4 md:px-6">
      {/* Logo et Bouton Outline (via composant client) à gauche */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Eclipse className="h-6 w-6" />
          <span className="sr-only">Accueil</span> {/* Pour accessibilité */}
        </Link>
        {/* Passer les données de l'outline et le slug du cours au trigger */}
        <CourseOutlineSheetTrigger courseOutlineData={courseOutlineData} courseSlug={courseSlug} />
      </div>

      {/* Boutons d'authentification à droite */}
      <div className="ml-auto">
        <AuthButtons />
      </div>
    </header>
  )
}
