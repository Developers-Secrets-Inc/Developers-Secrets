import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'usageCount', 'creatorId'],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Test', value: 'test' },
        { label: 'Public', value: 'public' },
      ],
      defaultValue: 'test',
      required: true,
    },
    {
      name: 'usageCount',
      label: 'Usage Count',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'creatorId',
      label: 'Creator ID',
      type: 'text',
      required: true,
    },
    {
      name: 'lastUsedAt',
      label: 'Last Used At',
      type: 'date',
      required: true,
    },
  ],
}
