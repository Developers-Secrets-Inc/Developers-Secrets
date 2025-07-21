import type { CollectionConfig } from 'payload'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'maxTier', 'isActive'],
  },
  labels: {
    singular: 'Achievement',
    plural: 'Achievements',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The title of the achievement',
      },
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Experience gained', value: 'experience_gained' },
        { label: 'Challenges completed', value: 'challenges_completed' },
        { label: 'Streak', value: 'streak' },
        { label: 'Tutorials Completed', value: 'tutorials_completed' },
        { label: 'Quests Completed', value: 'quests_completed' },
        { label: 'Items Used', value: 'items_used' },
        { label: 'Coins Earned', value: 'coins_earned' },
      ],
      admin: {
        description: 'The type of achievement that determines how progress is calculated',
      },
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'text',
      admin: {
        description: 'The icon identifier for this achievement',
      },
    },
    {
      name: 'maxTier',
      label: 'Maximum Tier',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: 4,
      admin: {
        description:
          'The maximum number of tiers for this achievement (typically 4 for Bronze, Silver, Gold, Diamond)',
      },
    },
    {
      name: 'tiers',
      label: 'Tiers',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'The different tiers of the achievement',
      },
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'select',
          required: true,
          options: [
            { label: 'Bronze', value: 'bronze' },
            { label: 'Silver', value: 'silver' },
            { label: 'Gold', value: 'gold' },
            { label: 'Diamond', value: 'diamond' },
            { label: 'Platinum', value: 'platinum' },
          ],
          admin: {
            description: 'The name of the tier (Bronze, Silver, Gold, etc.)',
          },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The description specific to this achievement tier',
          },
        },
        {
          name: 'threshold',
          label: 'Threshold',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'The value to reach to obtain this achievement tier',
          },
        },
        {
          name: 'rewardCoins',
          label: 'Reward (coins)',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'The number of coins given as a reward for this tier',
          },
        },
        {
          name: 'rewardXp',
          label: 'Reward (XP)',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'The number of experience points given as a reward for this tier',
          },
        },
        {
          name: 'rewardItem',
          label: 'Reward (Item)',
          type: 'relationship',
          relationTo: 'items',
          required: false,
          admin: {
            description: 'An optional item given as a reward for this tier.',
          },
        },
      ],
    },
    {
      name: 'nextAchievement',
      label: 'Next Achievement in Series',
      type: 'relationship',
      relationTo: 'achievements',
      required: false,
      admin: {
        description: 'Optional: The achievement that follows this one in a sequence.',
      },
    },
    {
      name: 'isActive',
      label: 'Is Active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Indicates if this achievement is currently active in the system',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        const now = new Date().toISOString()

        if (!data.createdAt) {
          data.createdAt = now
        }

        data.updatedAt = now

        return data
      },
    ],
  },
}
