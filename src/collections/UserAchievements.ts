import type { CollectionConfig } from 'payload'

export const UserAchievements: CollectionConfig = {
  slug: 'user-achievements',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'totalAchievements', 'lastUpdated'],
  },
  labels: {
    singular: 'Achievement Progress',
    plural: 'Achievement Progresses',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user this progress belongs to',
      },
    },
    {
      name: 'achievements',
      label: 'Achievements',
      type: 'array',
      admin: {
        description: "List of the user's achievement progresses",
      },
      fields: [
        {
          name: 'achievementId',
          label: 'Achievement ID',
          type: 'relationship',
          relationTo: 'achievements',
          required: true,
          admin: {
            description: 'The achievement this progress is linked to',
          },
        },
        {
          name: 'currentValue',
          label: 'Current Value',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'The current progress value for this achievement',
          },
        },
        {
          name: 'currentTier',
          label: 'Current Tier',
          type: 'select',
          options: [
            { label: 'Not Unlocked', value: 'none' },
            { label: 'Bronze', value: 'bronze' },
            { label: 'Silver', value: 'silver' },
            { label: 'Gold', value: 'gold' },
            { label: 'Diamond', value: 'diamond' },
            { label: 'Platinum', value: 'platinum' },
          ],
          defaultValue: 'none',
          admin: {
            description: 'The current tier reached for this achievement',
          },
        },
        {
          name: 'unlockedTiers',
          label: 'Unlocked Tiers',
          type: 'array',
          admin: {
            description: 'The tiers unlocked for this achievement',
          },
          fields: [
            {
              name: 'tier',
              label: 'Tier',
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
                description: 'The unlocked tier',
              },
            },
            {
              name: 'unlockedAt',
              label: 'Unlocked At',
              type: 'date',
              required: true,
              admin: {
                description: 'The date when this tier was unlocked',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'rewardClaimed',
              label: 'Reward Claimed',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Indicates if the reward for this tier has been claimed',
              },
            },
          ],
        },
        {
          name: 'lastUpdated',
          label: 'Last Updated',
          type: 'date',
          admin: {
            description: 'The date of the last update for this progress',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'totalAchievements',
      label: 'Total Achievements',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'The total number of achievements unlocked by the user',
        readOnly: true,
      },
    },
    {
      name: 'lastUpdated',
      label: 'Last Updated',
      type: 'date',
      admin: {
        description: 'The date of the last update for this collection',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Update the last modification date
        data.lastUpdated = new Date().toISOString()

        // Calculate the total number of unlocked achievements
        if (data.achievements) {
          let totalAchievements = 0

          data.achievements.forEach((achievement: any) => {
            if (achievement.currentTier && achievement.currentTier !== 'none') {
              totalAchievements++
            }
          })

          data.totalAchievements = totalAchievements
        } else {
          data.totalAchievements = 0
        }

        return data
      },
    ],
  },
}
