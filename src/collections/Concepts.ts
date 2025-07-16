import type { CollectionConfig } from 'payload'

export const Concepts: CollectionConfig = {
  slug: 'concepts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parentSkill', 'updatedAt'],
    description:
      'Represents abstract concepts (e.g., Loops, Encapsulation, Stacks). Can be linked to a parent skill (e.g., Encapsulation belongs to POO).',
  },
  fields: [
    {
      name: 'name',
      label: 'Concept Name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The name of the abstract concept (e.g., Loops, Encapsulation, Stacks).',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'A unique, URL-friendly identifier for the concept.',
      },
      // TODO: Add a hook to generate slug from name before validation
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'A brief description of the concept.',
      },
    },
    {
      name: 'type',
      label: 'Concept Type',
      type: 'select',
      options: [
        { label: 'Abstract', value: 'abstract' },
        { label: 'Concrete', value: 'concrete' },
      ],
      required: true,
      defaultValue: 'abstract',
      admin: {
        description: 'Distinguishes between abstract concepts (general ideas like "Loops") and concrete applications/implementations (specific tasks like "Iterate in a loop").',
      },
    },
    {
      name: 'subConcepts',
      label: 'Sub-Concepts',
      type: 'relationship',
      relationTo: 'concepts', // Self-relation
      hasMany: true,
      required: false,
      admin: {
        description: 'Concepts that are direct children of this concept. Used for calculating weighted average progression for abstract concepts.',
      },
    },
    {
      name: 'requiredConcepts',
      label: 'Required Concepts',
      type: 'relationship',
      relationTo: 'concepts', // Self-relation for prerequisites
      hasMany: true,
      admin: {
        description: 'Concepts that should generally be understood before tackling this one.',
      },
    },
  ],
  timestamps: true,
}
