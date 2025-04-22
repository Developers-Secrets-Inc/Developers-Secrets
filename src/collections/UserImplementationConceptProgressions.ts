import type { CollectionConfig } from 'payload'

export const UserImplementationConceptProgressions: CollectionConfig = {
  slug: 'userImplementationConceptProgressions',
  admin: {
    useAsTitle: 'id', // Or potentially generate a title like "User's Progress on Implementation Concept"
    defaultColumns: ['user', 'implementationConcept', 'progressValue', 'lastActivityAt'],
    description: "Stores a user's progress on a specific Implementation Concept.",
    // Hide this from the main admin nav unless needed for debugging
    // hidden: true, // Keep visible for now during development/debugging
  },
  fields: [
    {
      name: 'user', // Storing the Supabase User ID
      label: 'User ID (Supabase)',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The Supabase unique identifier for the user.',
        // readOnly: true,
      },
    },
    {
      name: 'implementationConcept',
      label: 'Implementation Concept',
      type: 'relationship',
      relationTo: 'implementationConcepts', // Link to the ImplementationConcepts collection
      required: true,
      index: true,
      admin: {
        // readOnly: true,
      },
    },
    {
      name: 'progressValue',
      label: 'Progress Value',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      max: 100, // Assuming a 0-100 scale
      admin: {
        description: "The user's current mastery level for this specific implementation (0-100).",
        step: 1,
      },
    },
    {
      name: 'lastActivityAt',
      label: 'Last Activity At',
      type: 'date',
      admin: {
        description: 'Timestamp of the last activity that contributed to this progression.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  // Ensure a user can only have one progression entry per implementation concept
  indexes: [
    {
      fields: { user: 1, implementationConcept: 1 },
      options: { unique: true },
    },
  ],
  timestamps: true,
}
