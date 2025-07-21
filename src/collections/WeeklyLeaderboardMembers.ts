import type { CollectionConfig } from 'payload'

export const WeeklyLeaderboardMembers: CollectionConfig = {
  slug: 'weekly-leaderboard-members',
  admin: {
    useAsTitle: 'userId', // Updated title reference
    defaultColumns: ['leaderboard', 'userId', 'weeklyExperience', 'finalRank'], // Updated column
    description: 'Links users to their weekly leaderboard group and tracks their performance.',
    // Consider hiding or making read-only in admin UI
    // hidden: true,
  },
  fields: [
    {
      name: 'leaderboard',
      label: 'Weekly Leaderboard',
      type: 'relationship',
      relationTo: 'weekly-division-leaderboards',
      required: true,
      index: true,
    },
    {
      name: 'userId', // Changed from 'user'
      label: 'User ID', // Updated label
      type: 'text', // Changed from 'relationship'
      required: true,
      index: true,
    },
    {
      name: 'weeklyExperience',
      label: 'Weekly Experience',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        description: 'Total experience gained during the specific week of this leaderboard.',
        readOnly: true, // Calculated at week end
      },
    },
    {
      name: 'finalRank',
      label: 'Final Rank',
      type: 'number',
      index: true,
      admin: {
        description: "User's final rank within this leaderboard group for the week.",
        readOnly: true, // Calculated at week end
      },
    },
  ],
  // Unique constraint logic should be handled during leaderboard creation/update
  // or potentially via database-level constraints if needed.
}
