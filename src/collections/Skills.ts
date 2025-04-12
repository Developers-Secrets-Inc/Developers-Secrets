import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'skillConcepts',
      label: 'Skill Concepts',
      type: 'relationship',
      relationTo: 'skill-concepts',
      hasMany: true,
    },
  ],
}
