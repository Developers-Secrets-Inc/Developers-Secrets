import type { CollectionConfig } from 'payload'

export const UserConceptProgressions: CollectionConfig = {
  slug: 'userConceptProgressions',
  admin: {
    useAsTitle: 'id', // Or potentially generate a title like "User's Progress on Concept"
    defaultColumns: ['user', 'concept', 'progressValue', 'lastActivityAt'],
    description: "Stores a user's progress on an abstract Concept.",
  },
  fields: [
    {
      name: 'user', // Storing the Supabase User ID
      label: 'User ID (Supabase)',
      type: 'text', // Changed from relationship to text
      required: true,
      index: true,
      admin: {
        description: 'The Supabase unique identifier for the user.',
        // readOnly: true, // Might still want this read-only in Admin UI
      },
    },
    {
      name: 'concept',
      label: 'Concept',
      type: 'relationship',
      relationTo: 'concepts', // Link to the Concepts collection
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
        description: "The user's current mastery level for this concept (0-100).",
        step: 1,
      },
    },
    {
      name: 'lastActivityAt',
      label: 'Last Activity At',
      type: 'date',
      admin: {
        description: 'Timestamp of the last activity that contributed to this concept progression.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  // Ensure a user can only have one progression entry per concept
  indexes: [
    {
      fields: ['user', 'concept'], // Corrected to array of field names
    },
  ],
  timestamps: true, // Tracks createdAt and updatedAt for the progression record itself
}
