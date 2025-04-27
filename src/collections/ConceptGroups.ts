import type { CollectionConfig } from 'payload'

export const ConceptGroups: CollectionConfig = {
  slug: 'conceptGroups',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Skills',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    // Add other fields as needed, e.g., icon
  ],
}
