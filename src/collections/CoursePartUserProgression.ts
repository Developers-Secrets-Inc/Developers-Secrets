import type { CollectionConfig } from 'payload'

export const CoursePartUserProgression: CollectionConfig = {
  slug: 'coursePartUserProgression',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['userId', 'part', 'completionStatus', 'updatedAt'],
    description: 'Tracks user progression for specific course parts.',
    group: 'User Data',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user who engaged with the part.',
        readOnly: true,
      },
    },
    {
      name: 'part',
      label: 'Course Part',
      type: 'relationship',
      relationTo: 'courseParts',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        description: 'The specific course part the user engaged with.',
        readOnly: true,
      },
    },
    {
      name: 'completionStatus',
      label: 'Completion Status',
      type: 'select',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'not_started',
      required: true,
      index: true,
      admin: {
        description: 'The completion status of the part for the user.',
      },
    },
    {
      name: 'isSolutionUnlocked',
      label: 'Solution Unlocked?',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      index: true,
      admin: {
        description: 'Indicates if the user has viewed the official solution for this part.',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
