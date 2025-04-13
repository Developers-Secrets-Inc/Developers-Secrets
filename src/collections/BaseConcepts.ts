import type { CollectionConfig } from 'payload'

export const BaseConcepts: CollectionConfig = {
  slug: 'base-concepts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description'],
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
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'requiredBaseConcepts',
      label: 'Required Base Concepts',
      type: 'relationship',
      relationTo: 'base-concepts',
      hasMany: true,
    },
    {
      name: 'nextBaseConcepts',
      label: 'Next Base Concepts',
      type: 'relationship',
      relationTo: 'base-concepts',
      hasMany: true,
    },
    {
      name: 'similarBaseConcepts',
      label: 'Similar Base Concepts',
      type: 'relationship',
      relationTo: 'base-concepts',
      hasMany: true,
    },
  ],
}
