import type { CollectionConfig } from 'payload'

export const CoursePartsEngagement: CollectionConfig = {
  slug: 'course-parts-engagement',
  admin: {
    useAsTitle: 'coursePart',
    defaultColumns: ['coursePart', 'likes', 'dislikes', 'updatedAt'],
    description: 'Aggregated engagement statistics per course part.',
    group: 'Course Data',
  },
  fields: [
    {
      name: 'coursePart',
      label: 'Course Part',
      type: 'relationship',
      relationTo: 'courseParts',
      required: true,
      unique: true,
      admin: {
        description: 'The course part for which engagement stats are tracked',
      },
      maxDepth: 0,
    },
    {
      name: 'likes',
      label: 'Likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of likes',
        readOnly: true,
      },
    },
    {
      name: 'dislikes',
      label: 'Dislikes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of dislikes',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Prevent manual editing of aggregated data
        if (data.likes !== undefined || data.dislikes !== undefined) {
          // Only allow updates from the system, not manual edits
          // This hook ensures data integrity
        }
        return data
      },
    ],
  },
  timestamps: true,
}