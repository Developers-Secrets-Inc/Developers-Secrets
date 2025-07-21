import type { CollectionConfig } from 'payload';

export const UserOverallSkillProgressions: CollectionConfig = {
  slug: 'user-overall-skill-progressions',
  admin: {
    useAsTitle: 'user',
  },
  fields: [
    {
      name: 'user',
      label: 'User ID',
      type: 'text',
      required: true,
      unique: true, // Assuming a user has only one overall progression per skill
    },
    {
      name: 'skill',
      label: 'Skill',
      type: 'relationship',
      relationTo: 'skills',
      required: true,
      unique: true, // Assuming a user has only one overall progression per skill
    },
    {
      name: 'overallMasteryPercentage',
      label: 'Overall Mastery Percentage',
      type: 'number',
      min: 0,
      max: 100,
      required: true,
      defaultValue: 0,
    },
    {
      name: 'lastUpdated',
      label: 'Last Updated',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
  ],
  indexes: [
    {
      fields: ['user', 'skill'],
      unique: true,
    },
  ],
};
