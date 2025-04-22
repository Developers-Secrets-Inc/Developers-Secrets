import type { CollectionConfig } from 'payload'

export const ImplementationConcepts: CollectionConfig = {
  slug: 'implementationConcepts',
  admin: {
    // Consider using a hook to generate a more descriptive title like "Concept Name in Skill Name"
    useAsTitle: 'name',
    defaultColumns: ['name', 'concept', 'implementationSkill', 'updatedAt'],
    description:
      'Represents a specific Concept applied within a particular Skill (e.g., Loops in Python, Encapsulation in Java).',
  },
  fields: [
    {
      name: 'concept',
      label: 'Abstract Concept',
      type: 'relationship',
      relationTo: 'concepts', // Link to the Concepts collection
      required: true,
      index: true,
      admin: {
        description: 'The abstract concept being implemented.',
      },
    },
    {
      name: 'implementationSkill',
      label: 'Implementation Skill',
      type: 'relationship',
      relationTo: 'skills', // Link to the Skills collection
      required: true,
      index: true,
      admin: {
        description: 'The specific skill (language, framework, etc.) where the concept is applied.',
      },
    },
    {
      // Optional: A specific name for this implementation (e.g., "Python For Loops")
      // Could be generated automatically by a hook later based on concept and skill names.
      name: 'name',
      label: 'Implementation Name (Optional)',
      type: 'text',
      // unique: true, // Might be too restrictive if generated?
      admin: {
        description:
          'Optional specific name for this implementation context (e.g., "Python For Loops", "Java Private Fields"). Can be auto-generated.',
      },
    },
    {
      name: 'slug',
      label: 'Slug (Optional)',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description:
          'Optional unique, URL-friendly identifier. Can be auto-generated from concept and skill slugs.',
      },
      // TODO: Add a hook to generate slug from concept and skill slugs before validation
    },
    {
      name: 'description',
      label: 'Description (Optional)',
      type: 'textarea',
      admin: {
        description: 'Optional description specific to this implementation context.',
      },
    },
    // We might add fields here later to store implementation-specific details or examples if needed.
  ],
  // Add a unique index across the combination of concept and skill to prevent duplicates
  indexes: [
    {
      fields: { concept: 1, implementationSkill: 1 },
      options: { unique: true },
    },
  ],
  timestamps: true,
}
