import type { CollectionConfig } from 'payload'

export const Quests: CollectionConfig = {
  slug: 'quests',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'difficulty', 'objectiveType', 'rewardType'],
  },
  labels: {
    singular: 'Quest',
    plural: 'Quests',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The title of the quest',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The detailed description of the quest',
      },
    },
    {
      name: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Expert', value: 'expert' },
      ],
      admin: {
        description: 'The difficulty level of the quest',
      },
    },
    {
      name: 'objectiveType',
      label: 'Objective Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Complete Exercises', value: 'complete_exercises' },
        { label: 'Earn Experience Points', value: 'earn_xp' },
        { label: 'Reach Level', value: 'reach_level' },
        { label: 'Maintain Streak', value: 'maintain_streak' },
        { label: 'Use Items', value: 'use_items' },
        { label: 'Complete Tutorials', value: 'complete_tutorials' },
      ],
      admin: {
        description: 'The type of objective to achieve',
      },
    },
    {
      name: 'objectiveValue',
      label: 'Objective Value',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'The numerical value of the objective (ex: 5 exercises, 1000 XP, level 10)',
      },
    },
    {
      name: 'rewardType',
      label: 'Reward Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Coins', value: 'coins' },
        { label: 'Experience', value: 'xp' },
        { label: 'Item', value: 'item' },
      ],
      admin: {
        description: 'The type of reward offered for completing the quest',
      },
    },
    {
      name: 'rewardValue',
      label: 'Reward Value',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'The numerical value of the reward (ex: 100 coins, 500 XP)',
      },
    },
    {
      name: 'rewardItemType',
      label: 'Item Type (if reward = item)',
      type: 'select',
      options: [
        { label: 'Experience Boost', value: 'experience_boost' },
        { label: 'Streak Saver', value: 'streak_saver' },
        { label: 'Streak Recovery', value: 'streak_recovery' },
        { label: 'Solution Viewer', value: 'solution_viewer' },
        { label: 'Chest', value: 'chest' },
      ],
      admin: {
        description: "The type of item to give as a reward (only if reward type is 'item')",
        condition: (data) => data.rewardType === 'item',
      },
    },
    {
      name: 'rewardItemVariant',
      label: 'Item Variant (if reward = item)',
      type: 'select',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Premium', value: 'premium' },
        { label: 'Legendary', value: 'legendary' },
      ],
      admin: {
        description: "The variant of the item to give as a reward (only if reward type is 'item')",
        condition: (data) => data.rewardType === 'item',
      },
    },
    {
      name: 'isActive',
      label: 'Is Active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Indicates if the quest is currently active and available to users',
      },
    },
    {
      name: 'isRepeatable',
      label: 'Is Repeatable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Indicates if the quest can be completed multiple times by a user',
      },
    },
    {
      name: 'cooldownHours',
      label: 'Cooldown Hours',
      type: 'number',
      min: 0,
      admin: {
        description: 'The time in hours before a user can repeat this quest (if repeatable)',
        condition: (data) => data.isRepeatable === true,
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
