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
      name: 'parentSkill',
      label: 'Parent Skill (Optional)',
      type: 'relationship',
      relationTo: 'skills', // Relates to the Skills collection
      required: false, // This concept might be fundamental and not belong to a specific skill/paradigm
      admin: {
        description:
          'Optional: The main skill or paradigm this concept belongs to (e.g., Encapsulation belongs to POO). Helps categorize and link concepts.',
      },
    },
    {
      name: 'parentConcept',
      label: 'Parent Concept (for Grouping)',
      type: 'relationship',
      relationTo: 'concepts', // Self-relation
      hasMany: false, // A concept belongs to at most one parent group concept
      required: false, // Optional, not all concepts need a grouping parent
      admin: {
        description:
          'Optional: Select another concept that acts as a logical parent or category for this one (e.g., "Data Types" could be the parent of "Strings").',
        position: 'sidebar', // Keep sidebar less cluttered
      },
      filterOptions: ({ id }) => {
        // Prevent a concept from being its own parent
        if (id) {
          return { id: { not_equals: id } }
        }
        return true
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
    {
      name: 'nextConcepts',
      label: 'Next Concepts',
      type: 'relationship',
      relationTo: 'concepts', // Self-relation for follow-up concepts
      hasMany: true,
      admin: {
        description: 'Concepts that logically follow this one in potential learning paths.',
      },
    },
    {
      name: 'groups', // Categories/groups this concept belongs to
      label: 'Concept Groups',
      type: 'relationship',
      relationTo: 'conceptGroups',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
