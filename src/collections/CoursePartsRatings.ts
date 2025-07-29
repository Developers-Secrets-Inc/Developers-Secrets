import type { CollectionConfig } from 'payload'

export const CoursePartsRatings: CollectionConfig = {
  slug: 'course-parts-ratings',
  admin: {
    useAsTitle: 'coursePart',
    defaultColumns: ['coursePart', 'total', 'count', 'average', 'updatedAt'],
    description: 'Aggregated rating statistics per course part.',
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
        description: 'The course part this rating aggregate is for',
      },
      maxDepth: 0,
    },
    {
      name: 'total',
      label: 'Total Rating Points',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sum of all rating points',
        readOnly: true,
      },
    },
    {
      name: 'count',
      label: 'Rating Count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of ratings received',
        readOnly: true,
      },
    },
    {
      name: 'average',
      label: 'Average Rating',
      type: 'number',
      admin: {
        description: 'Average rating (0-5)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const total = siblingData?.total || 0
            const count = siblingData?.count || 0

            if (count > 0) {
              return parseFloat((total / count).toFixed(1))
            }
            return 0
          },
        ],
      },
    },
  ],
  timestamps: true,
}