import type { CollectionConfig } from 'payload'

export const SkillConcepts: CollectionConfig = {
  slug: 'skill-concepts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['baseConcept', 'skill', 'difficulty'],
  },
  fields: [
    {
      name: 'baseConcept',
      label: 'Base Concept',
      type: 'relationship',
      relationTo: 'base-concepts',
      required: true,
    },
    {
      name: 'skill',
      label: 'Skill',
      type: 'relationship',
      relationTo: 'skills',
      required: true,
    },
    {
      name: 'difficulty',
      label: 'Difficulty',
      type: 'number',
      min: 1,
      max: 5,
    },
  ],
}
