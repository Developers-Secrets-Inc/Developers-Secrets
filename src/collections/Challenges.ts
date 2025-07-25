import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

// Fonction pour calculer l'expérience basée sur la difficulté
const calculateExperience = (difficulty: string): number => {
  const difficultyRanks: Record<string, number> = {
    very_easy: 0.5,
    easy: 1,
    medium: 2,
    hard: 3,
    horrible: 4,
  }

  // Base: 50 points par rang de difficulté
  return 50 * (difficultyRanks[difficulty] || 1)
}

export const Challenges: CollectionConfig = {
  slug: 'challenges',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'difficulty', 'baseExperience', 'engagement', 'createdAt'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the challenge',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      admin: {
        description: 'URL-friendly identifier for this challenge. Will be used in the URL.',
      },
    },
    {
      name: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      options: [
        { label: 'Very Easy', value: 'very_easy' },
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Horrible', value: 'horrible' },
      ],
      required: true,
      defaultValue: 'medium',
      admin: {
        description: 'The difficulty level of the challenge',
        position: 'sidebar',
      },
    },
    {
      name: 'baseExperience',
      label: 'Base Experience',
      type: 'number',
      admin: {
        description:
          'Experience points awarded for completing this challenge (calculated automatically)',
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Calculer automatiquement l'expérience basée sur la difficulté
            if (data?.difficulty) {
              return calculateExperience(data.difficulty)
            }
            return 50 // Valeur par défaut si la difficulté n'est pas définie
          },
        ],
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'group',
      admin: {
        description: 'Challenge description and problem statement',
      },
      fields: [
        {
          name: 'statement',
          label: 'Statement',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Problem statement and challenge description',
          },
        },
        {
          name: 'hints',
          label: 'Hints',
          type: 'array',
          admin: {
            description: 'Helpful hints for solving the challenge',
          },
          fields: [
            {
              name: 'content',
              label: 'Hint Content',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          name: 'similarChallenges',
          label: 'Similar Challenges',
          type: 'array',
          admin: {
            description: 'List of related challenges',
          },
          fields: [
            {
              name: 'challenge',
              label: 'Challenge',
              type: 'relationship',
              relationTo: 'challenges',
              required: true,
              admin: {
                description: 'Select a related challenge',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'officialSolution',
      label: 'Official Solution',
      type: 'group',
      admin: {
        description: 'The official solution for this challenge',
      },
      fields: [
        {
          name: 'statement',
          label: 'Solution Statement',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The content of the official solution',
          },
        },
      ],
    },
    {
      name: 'codeVersions',
      label: 'Challenge Code Versions',
      type: 'array',
      admin: {
        description: 'Different programming language versions of this challenge',
      },
      fields: [
        {
          name: 'language',
          label: 'Programming Language',
          type: 'text',
          required: true,
          admin: {
            description: 'Programming language for this version',
          },
        },
        {
          name: 'initialCode',
          label: 'Initial Code',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Initial code provided to users for this language',
          },
        },
        {
          name: 'testCases',
          label: 'Test Cases',
          type: 'array',
          admin: {
            description: 'Test cases for validating solutions in this language',
          },
          fields: [
            {
              name: 'input',
              label: 'Input',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Input data for the test case',
              },
            },
            {
              name: 'expectedOutput',
              label: 'Expected Output',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Expected output for this test case',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'draft',
      label: 'Draft',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Indique si le challenge est en mode brouillon (draft)',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true, // Ajout automatique des champs createdAt et updatedAt
}
