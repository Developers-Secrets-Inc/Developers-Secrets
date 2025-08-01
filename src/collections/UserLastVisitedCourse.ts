import type { CollectionConfig } from 'payload'

export const UserLastVisitedCourse: CollectionConfig = {
  slug: 'userLastVisitedCourse',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'course', 'lastVisitedAt', 'lastChapterSlug', 'lastPartSlug'],
    description: 'Tracks the last course visited by each user',
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
        description: 'The Supabase user ID',
        readOnly: true,
      },
    },
    {
      name: 'course',
      label: 'Course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        description: 'The course that was last visited',
        readOnly: true,
      },
    },
    {
      name: 'lastVisitedAt',
      label: 'Last Visited At',
      type: 'date',
      required: true,
      admin: {
        description: 'When the course was last visited',
        readOnly: true,
      },
    },
    {
      name: 'lastChapterSlug',
      label: 'Last Chapter Slug',
      type: 'text',
      admin: {
        description: 'The slug of the last visited chapter',
        readOnly: true,
      },
    },
    {
      name: 'lastPartSlug',
      label: 'Last Part Slug',
      type: 'text',
      admin: {
        description: 'The slug of the last visited part',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
