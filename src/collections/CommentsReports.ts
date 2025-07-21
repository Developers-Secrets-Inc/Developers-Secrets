import type { CollectionConfig } from 'payload'

export const CommentsReports: CollectionConfig = {
  slug: 'comments-reports',
  admin: {
    useAsTitle: 'comment',
  },
  fields: [
    {
      name: 'comment',
      label: 'Comment',
      type: 'relationship',
      relationTo: 'comments',
      admin: {
        description: 'Comment of this report',
      },
    },
    {
      name: 'userId',
      type: 'text',
      required: true,
    },
    {
      name: 'reason',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'details',
      type: 'text',
      required: false,
      maxLength: 1000,
    },
  ],
}
