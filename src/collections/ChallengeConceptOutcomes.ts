import type { CollectionConfig } from 'payload'

export const ChallengeConceptOutcomes: CollectionConfig = {
  slug: 'challenge-concept-outcomes',
  admin: {
    useAsTitle: 'challenge',
  },
  fields: [
    {
      name: 'challenge',
      label: 'Challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      unique: true, // One outcome per challenge
      maxDepth: 0,
    },
    {
      name: 'conceptProgressions',
      label: 'Concept Progressions',
      type: 'array',
      fields: [
        {
          name: 'concept',
          label: 'Concept',
          type: 'relationship',
          relationTo: 'concepts',
          required: true,
          // TODO: Add validation to ensure this is a concrete concept
        },
        {
          name: 'completionPercentage',
          label: 'Completion Percentage',
          type: 'number',
          min: 0,
          max: 100,
          required: true,
        },
      ],
    },
  ],
  indexes: [
    {
      fields: ['challenge'],
      unique: true,
    },
  ],
}
