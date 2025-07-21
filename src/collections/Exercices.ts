import type { CollectionConfig } from 'payload'

export const Exercices: CollectionConfig = {
  slug: 'exercices',
  admin: {
    useAsTitle: 'title'
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the exercice',
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
        description: 'The difficulty level of the exercice',
        position: 'sidebar',
      },
    },
    {
      name: 'hints',
      label: 'Hints',
      type: 'array',
      admin: {
        description: 'Helpful hints for solving the exercice',
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
      name: 'languages',
      label: 'Languages',
      type: 'array',
      required: true,
      admin: {
        description: 'Supported languages for this exercice',
      },
      fields: [
        {
          name: 'language',
          label: 'Language',
          type: 'select',
          options: [
            { label: 'Python', value: 'python' },
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
          ],
          required: true,
        },
        {
          name: 'initialCode',
          label: 'Initial Code',
          type: 'textarea',
          admin: {
            description: 'Initial code provided to users (optional)',
          },
        },
        {
          name: 'testCases',
          label: 'Test Cases',
          type: 'array',
          required: true,
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
  ],
} 