import type { CollectionConfig } from 'payload'

export const CourseParts: CollectionConfig = {
  slug: 'courseParts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'difficulty', 'updatedAt'],
    description: 'Represents a distinct part or module within a course.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Part Name',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of this course part (e.g., Introduction to Variables).',
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
        description: 'A unique, URL-friendly identifier for the part.',
      },
      // TODO: Add a hook to generate slug from name before validation
    },
    {
      name: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Horrible', value: 'horrible' },
      ],
      defaultValue: 'medium',
      admin: {
        position: 'sidebar',
        description: 'The difficulty level of this part.',
      },
    },
    {
      name: 'description',
      label: 'Description & Hints',
      type: 'group',
      fields: [
        {
          name: 'statement',
          label: 'Statement',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The main content or explanation for this part.',
          },
        },
        {
          name: 'hints',
          label: 'Hints',
          type: 'array',
          minRows: 0,
          admin: {
            description: 'Optional hints to help the user.',
          },
          fields: [
            {
              name: 'content',
              label: 'Hint Content',
              type: 'textarea',
              required: true,
            },
            {
              name: 'isVisible', // Consider if this needs admin UI control or is set programmatically
              label: 'Is Visible Initially',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'officialSolution',
      label: 'Official Solution',
      type: 'group',
      fields: [
        {
          name: 'statement',
          label: 'Solution Statement',
          type: 'textarea',
          admin: {
            description: 'The official solution or explanation for this part.',
          },
        },
      ],
    },
    {
      name: 'engagement',
      label: 'Engagement Metrics',
      type: 'group',
      admin: {
        description: 'User engagement data for this part.',
      },
      fields: [
        {
          name: 'likes',
          label: 'Likes',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true, // Often updated programmatically
          },
        },
        {
          name: 'dislikes',
          label: 'Dislikes',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true, // Often updated programmatically
          },
        },
      ],
    },
    {
      name: 'exercice',
      label: 'Exercice',
      type: 'relationship',
      relationTo: ['exercices', 'ai-exercices'],
      admin: {
        description: 'Linked exercice (AI or classic) for this course part.',
        position: 'sidebar',
      },
    },

    
  ],
  timestamps: true,
}
