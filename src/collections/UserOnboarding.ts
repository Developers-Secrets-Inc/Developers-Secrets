import { CollectionConfig } from 'payload'

const UserOnboarding: CollectionConfig = {
  slug: 'user-onboarding',
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
    },
    {
      name: 'skipped',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'codingLevel',
      type: 'select',
      options: [
        {
          value: 'beginner',
          label: 'Beginner',
        },
        {
          value: 'intermediate',
          label: 'Intermediate',
        },
        {
          value: 'advanced',
          label: 'Advanced',
        },
      ],
      required: false,
    },
    {
      name: 'timeCoding',
      type: 'select',
      options: [
        {
          value: 'less-than-6-months',
          label: 'Less than 6 months',
        },
        {
          value: 'less-than-1-year',
          label: 'Less than 1 year',
        },
        {
          value: '1-2-years',
          label: '1-2 years',
        },
        {
          value: '3-5-years',
          label: '3-5 years',
        },
        {
          value: '5-plus-years',
          label: '5+ years',
        },
      ],
      required: false,
    },
    {
      name: 'selectedLanguages',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
    {
      name: 'selectedConcepts',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
    {
      name: 'selectedGoals',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
    {
      name: 'selectedTechnologiesToLearn',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
  ],
}

export default UserOnboarding
