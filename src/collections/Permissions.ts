import type { CollectionConfig } from 'payload'

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'isActive'],
  },
  labels: {
    singular: 'Permission',
    plural: 'Permissions',
  },
  fields: [
    {
      name: 'name',
      label: 'Permission Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'code',
      label: 'Permission Code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique code used to identify this permission in the system',
      },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        {
          label: 'Content',
          value: 'content',
        },
        {
          label: 'Users',
          value: 'users',
        },
        {
          label: 'System',
          value: 'system',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      defaultValue: 'other',
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

