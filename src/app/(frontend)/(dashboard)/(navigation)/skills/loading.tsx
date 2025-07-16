import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// TODO: Replace with a proper loading spinner or skeleton UI
export default function Loading() {
  return (
    // Utiliser DashboardLayout pour maintenir la structure globale
    <DashboardLayout>
      {/* Conteneur principal similaire à celui de SkillsClientWrapper */}
      <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto px-4 mx-auto">
        <div className="flex flex-col h-full">
          {/* Squelette pour le sélecteur */}
          <div className="p-4 border-b">
            <Skeleton className="h-10 w-[280px]" />
          </div>
          {/* Squelette pour la zone de contenu principale (SkillTreeViewer) */}
          <div className="flex-grow p-4">
            {/* Ajouter plusieurs lignes de squelettes pour simuler le contenu */}
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
            {/* On pourrait ajouter d'autres squelettes pour mieux simuler l'arbre */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
