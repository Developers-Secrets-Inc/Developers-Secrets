import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    description:
      'Represents technical or conceptual skills (e.g., Python, React, POO, Algorithms).',
  },
  fields: [
    {
      name: 'name',
      label: 'Skill Name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The name of the skill (e.g., Python, React, Object-Oriented Programming).',
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
        description: 'A unique, URL-friendly identifier for the skill.',
        // Ideally, generate this from the name using a hook
      },
      // TODO: Add a hook to generate slug from name before validation
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'A brief description of the skill and its scope.',
      },
    },
    // Optional: Uncomment and adjust if needed later for defining skill prerequisites
    // {
    //   name: 'requiredConcepts',
    //   label: 'Required Foundational Concepts',
    //   type: 'relationship',
    //   relationTo: 'concepts', // Will relate to the 'Concepts' collection we create next
    //   hasMany: true,
    //   admin: {
    //     description: 'Optional: Foundational concepts generally required to effectively learn or use this skill.',
    //   },
    // },
  ],
  timestamps: true,
}
