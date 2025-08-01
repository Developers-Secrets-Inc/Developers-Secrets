import type { CollectionConfig } from 'payload'

export const CoursePartEngagement: CollectionConfig = {
  slug: 'course-part-engagement',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['coursePart', 'userId', 'type', 'updatedAt'],
    description: 'Individual user engagement (like/dislike) for course parts.',
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
        description: 'The course part being engaged with',
      },
      maxDepth: 0,
    },
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      admin: {
        description: 'The user who liked/disliked',
      },
    },
    {
      name: 'type',
      label: 'Engagement Type',
      type: 'select',
      options: [
        { label: 'Like', value: 'like' },
        { label: 'Dislike', value: 'dislike' },
      ],
      required: true,
      admin: {
        description: 'Type of engagement (like or dislike)',
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
        const type = doc.type
        const payload = req.payload

        // Find the aggregate for this course part
        const [aggregate] = await payload
          .find({
            collection: 'course-parts-engagement',
            where: { coursePart: { equals: coursePartId } },
            limit: 1,
          })
          .then((result) => result.docs)

        if (aggregate) {
          // Count current likes and dislikes
          const [likesResult, dislikesResult] = await Promise.all([
            payload.find({
              collection: 'course-part-engagement',
              where: {
                coursePart: { equals: coursePartId },
                type: { equals: 'like' },
              },
              limit: 0, // Only count
            }),
            payload.find({
              collection: 'course-part-engagement',
              where: {
                coursePart: { equals: coursePartId },
                type: { equals: 'dislike' },
              },
              limit: 0, // Only count
            }),
          ])

          // Update the aggregate
          await payload.update({
            collection: 'course-parts-engagement',
            id: aggregate.id,
            data: {
              likes: likesResult.totalDocs,
              dislikes: dislikesResult.totalDocs,
            },
          })
        } else {
          // Create new aggregate if it doesn't exist
          const [likesResult, dislikesResult] = await Promise.all([
            payload.find({
              collection: 'course-part-engagement',
              where: {
                coursePart: { equals: coursePartId },
                type: { equals: 'like' },
              },
              limit: 0,
            }),
            payload.find({
              collection: 'course-part-engagement',
              where: {
                coursePart: { equals: coursePartId },
                type: { equals: 'dislike' },
              },
              limit: 0,
            }),
          ])

          await payload.create({
            collection: 'course-parts-engagement',
            data: {
              coursePart: coursePartId,
              likes: likesResult.totalDocs,
              dislikes: dislikesResult.totalDocs,
            },
          })
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const coursePartId = doc.coursePart
        const payload = req.payload

        // Find the aggregate for this course part
        const [aggregate] = await payload
          .find({
            collection: 'course-parts-engagement',
            where: { coursePart: { equals: coursePartId } },
            limit: 1,
          })
          .then((result) => result.docs)

        if (aggregate) {
          // Recount likes and dislikes
          const [likesResult, dislikesResult] = await Promise.all([
            payload.find({
              collection: 'course-part-engagement',
              where: {
                coursePart: { equals: coursePartId },
                type: { equals: 'like' },
              },
              limit: 0,
            }),
            payload.find({
              collection: 'course-part-engagement',
              where: {
                coursePart: { equals: coursePartId },
                type: { equals: 'dislike' },
              },
              limit: 0,
            }),
          ])

          // Update the aggregate
          await payload.update({
            collection: 'course-parts-engagement',
            id: aggregate.id,
            data: {
              likes: likesResult.totalDocs,
              dislikes: dislikesResult.totalDocs,
            },
          })
        }
      },
    ],
  },
  timestamps: true,
}