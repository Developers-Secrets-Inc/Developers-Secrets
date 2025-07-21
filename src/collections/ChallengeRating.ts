import type { CollectionConfig } from 'payload'

export const ChallengeRating: CollectionConfig = {
  slug: 'challenge-rating',
  fields: [
    {
      name: 'challenge',
      label: 'Challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      admin: {
        description: 'The challenge being rated',
      },
      maxDepth: 0,
    },
    {
      name: 'userId',
      label: 'UserId',
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
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const challengeId = doc.challenge
        const ratingValue = doc.rating
        const userId = doc.userId
        const payload = req.payload

        // On cherche l'agrégat pour ce challenge
        const [aggregate] = await payload
          .find({
            collection: 'challenges-ratings',
            where: { id: { equals: challengeId } },
            limit: 1,
          })
          .then((res) => res.docs)

        if (operation === 'create') {
          // Création d'un nouveau rating
          if (aggregate) {
            await payload.update({
              collection: 'challenges-ratings',
              id: challengeId,
              data: {
                total: (aggregate.total || 0) + ratingValue,
                count: (aggregate.count || 0) + 1,
              },
              req,
            })
          } else {
            await payload.create({
              collection: 'challenges-ratings',
              data: {
                id: challengeId,
                total: ratingValue,
                count: 1,
              },
              req,
            })
          }
        } else if (operation === 'update' && previousDoc) {
          // Modification d'un rating existant
          const previousRating = previousDoc.rating
          if (aggregate) {
            await payload.update({
              collection: 'challenges-ratings',
              id: challengeId,
              data: {
                total: (aggregate.total || 0) - previousRating + ratingValue,
                // count ne change pas
              },
              req,
            })
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const challengeId = doc.challenge
        const ratingValue = doc.rating
        const payload = req.payload

        // On cherche l'agrégat pour ce challenge
        const [aggregate] = await payload
          .find({
            collection: 'challenges-ratings',
            where: { id: { equals: challengeId } },
            limit: 1,
          })
          .then((res) => res.docs)

        if (aggregate) {
          const newCount = (aggregate.count || 1) - 1
          const newTotal = (aggregate.total || 0) - ratingValue
          await payload.update({
            collection: 'challenges-ratings',
            id: challengeId,
            data: {
              total: newTotal < 0 ? 0 : newTotal,
              count: newCount < 0 ? 0 : newCount,
            },
            req,
          })
        }
      },
    ],
  },
}
