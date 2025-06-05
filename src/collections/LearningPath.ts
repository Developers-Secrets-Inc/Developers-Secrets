import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'

export const LearningPath: CollectionConfig = {
  slug: 'learning-paths',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'icon'],
    group: 'Courses',
  },
  labels: {
    singular: 'Learning Path',
    plural: 'Learning Paths',
  },
  fields: [
    {
      name: 'name',
      label: 'Learning Path Name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'select',
      required: true,
      options: [
        { label: 'Binary', value: 'binary' },
        { label: 'Code', value: 'code' },
        { label: 'Robotic Brain', value: 'robotic-brain' },
      ],
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sections',
      label: 'Sections',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          label: 'Section Name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Section Description',
          type: 'textarea',
        },
        {
          name: 'courses',
          label: 'Courses',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'course',
              label: 'Course',
              type: 'relationship',
              relationTo: 'courses',
              required: true,
            },
            {
              name: 'isChoiceGroup',
              label: 'Part of a Choice Group',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'choiceGroupId',
              label: 'Choice Group ID',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData.isChoiceGroup === true,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        revalidateTag('learning-paths')
      },
    ],
  },
}
