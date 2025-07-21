import type { CollectionConfig } from 'payload'

export const UserQuests: CollectionConfig = {
  slug: 'user-quests',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'currentProgression', 'isCompleted'],
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'quest',
      type: 'relationship',
      relationTo: 'quests',
      required: true,
    },
    {
      name: 'currentProgression',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'isCompleted',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
  ],
}
