import type { CollectionConfig } from 'payload'

export const Quests: CollectionConfig = {
  slug: 'quests',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'difficulty', 'value', 'experience'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Experience Gained',
          value: 'experienceGained',
        },
        {
          label: 'Challenges Completed',
          value: 'challengesCompleted',
        },
        {
          label: 'Increased Level',
          value: 'increasedLevel',
        },
      ],
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Easy',
          value: 'easy',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Hard',
          value: 'hard',
        },
      ],
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'experience',
      type: 'number',
      required: true,
      min: 0,
    },
  ],
}
