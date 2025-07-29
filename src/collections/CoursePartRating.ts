import type { CollectionConfig } from 'payload'

export const CoursePartRating: CollectionConfig = {
  slug: 'course-part-rating',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['coursePart', 'userId', 'rating', 'updatedAt'],
    description: 'Individual user ratings for course parts.',
    group: 'Course Data',
  },
  fields: [
    {
      name: 'coursePart',
      label: 'Course Part',
      type: 'relationship',
      relationTo: 'courseParts',
      required: true,
      admin: {
        description: 'The course part being rated',
      },
      maxDepth: 0,
    },
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      admin: {
        description: 'The user who gave the rating',
      },
    },
    {
      name: 'rating',
      label: 'Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: 'Rating value (1-5)',
      },
    },
  ],
  indexes: [
    {
      fields: ['coursePart', 'userId'],
      unique: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const coursePartId = doc.coursePart
        const ratingValue = doc.rating
        const userId = doc.userId
        const payload = req.payload

        // Find the aggregate for this course part
        const [aggregate] = await payload
          .find({
            collection: 'course-parts-ratings',
            where: { coursePart: { equals: coursePartId } },
            limit: 1,
          })
          .then((result) => result.docs)

        if (aggregate) {
          // Calculate new totals
          let newTotal = aggregate.total
          let newCount = aggregate.count

          if (operation === 'create') {
            newTotal += ratingValue
            newCount += 1
          } else if (operation === 'update' && previousDoc) {
            // Remove old rating and add new one
            newTotal = newTotal - previousDoc.rating + ratingValue
            // Count stays the same for updates
          }

          // Update the aggregate
          await payload.update({
            collection: 'course-parts-ratings',
            id: aggregate.id,
            data: {
              total: newTotal,
              count: newCount,
            },
          })
        } else {
          // Create new aggregate if it doesn't exist
          await payload.create({
            collection: 'course-parts-ratings',
            data: {
              coursePart: coursePartId,
              total: ratingValue,
              count: 1,
            },
          })
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const coursePartId = doc.coursePart
        const ratingValue = doc.rating
        const payload = req.payload

        // Find the aggregate for this course part
        const [aggregate] = await payload
          .find({
            collection: 'course-parts-ratings',
            where: { coursePart: { equals: coursePartId } },
            limit: 1,
          })
          .then((result) => result.docs)

        if (aggregate) {
          const newTotal = Math.max(0, aggregate.total - ratingValue)
          const newCount = Math.max(0, aggregate.count - 1)

          // Update the aggregate
          await payload.update({
            collection: 'course-parts-ratings',
            id: aggregate.id,
            data: {
              total: newTotal,
              count: newCount,
            },
          })
        }
      },
    ],
  },
  timestamps: true,
}