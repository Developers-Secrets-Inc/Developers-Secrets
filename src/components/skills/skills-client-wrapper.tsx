'use client'

import React, { useState, useMemo } from 'react'
import SkillTreeViewer from './skill-tree-viewer' // Garder l'import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' // Importer les composants Select de shadcn/ui

// Définir le type pour une compétence (ajuster si nécessaire)
interface Skill {
  id: string
  slug: string
  name: string
}

interface SkillsClientWrapperProps {
  skills: Skill[] // Recevoir la liste des skills en prop
}

function SkillsClientWrapper({ skills }: SkillsClientWrapperProps) {
  // État pour la compétence sélectionnée (initialiser avec le premier skill si disponible)
  const [selectedSkillSlug, setSelectedSkillSlug] = useState<string | undefined>(skills[0]?.slug)

  // Trouver l'objet skill complet basé sur le slug sélectionné
  // const selectedSkill = useMemo(() => {
  //   return skills.find((skill) => skill.slug === selectedSkillSlug)
  // }, [selectedSkillSlug, skills])

  // Gérer le changement de sélection
  const handleSkillChange = (slug: string) => {
    setSelectedSkillSlug(slug)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sélecteur de compétences */}
      <div className="p-4 border-b">
        {' '}
        {/* Ajouter un peu de style */}
        <Select value={selectedSkillSlug} onValueChange={handleSkillChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a skill" />
          </SelectTrigger>
          <SelectContent>
            {skills.map((skill) => (
              <SelectItem key={skill.id} value={skill.slug}>
                {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conteneur pour le SkillTreeViewer qui prend la hauteur restante */}
      <div className="flex-grow">
        {/* Passer le slug de la compétence sélectionnée à SkillTreeViewer */}
        <SkillTreeViewer selectedSkillSlug={selectedSkillSlug} />
      </div>
    </div>
  )
}

export default SkillsClientWrapper
 