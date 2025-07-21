import { CollectionConfig } from 'payload'

export const UserFollowingInformations: CollectionConfig = {
  slug: 'user-following-informations',
  admin: {
    useAsTitle: 'userId',
    description: 'User following relationships and blocked users',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'followers',
      type: 'array',
      label: 'Followers',
      defaultValue: [],
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'following',
      type: 'array',
      label: 'Following',
      defaultValue: [],
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'blockedUsers',
      type: 'array',
      label: 'Blocked Users',
      defaultValue: [],
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
