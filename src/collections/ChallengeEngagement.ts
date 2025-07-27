import type { CollectionConfig } from 'payload'

export const ChallengeEngagement: CollectionConfig = {
  slug: 'challenge-engagement',
  fields: [
    {
      name: 'challenge',
      label: 'Challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      admin: {
        description: 'The challenge being engaged with',
      },
      maxDepth: 0,
    },
    {
      name: 'userId',
      label: 'UserId',
      type: 'text',
      required: true,
      admin: {
        description: 'The user who liked/disliked',
      },
    },
    {
      name: 'type',
      label: 'Type',
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
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const challengeId = doc.challenge
        const type = doc.type
        const payload = req.payload

        // On cherche l'agrégat pour ce challenge
        const [aggregate] = await payload
          .find({
            collection: 'challenges-engagement',
            where: { challenge: { equals: challengeId } },
            limit: 1,
          })
          .then((res) => res.docs)

        // Helper pour incrémenter/décrémenter
        const updateCounts = (likesDelta = 0, dislikesDelta = 0) => {
          if (aggregate) {
            return payload.update({
              collection: 'challenges-engagement',
              id: aggregate.id,
              data: {
                likes: (aggregate.likes || 0) + likesDelta,
                dislikes: (aggregate.dislikes || 0) + dislikesDelta,
              },
              req,
            })
          } else {
            return payload.create({
              collection: 'challenges-engagement',
              data: {
                challenge: challengeId,
                likes: likesDelta > 0 ? likesDelta : 0,
                dislikes: dislikesDelta > 0 ? dislikesDelta : 0,
              },
              req,
            })
          }
        }

        if (operation === 'create') {
          // Création d'un engagement
          if (type === 'like') {
            await updateCounts(1, 0)
          } else if (type === 'dislike') {
            await updateCounts(0, 1)
          }
        } else if (operation === 'update' && previousDoc) {
          // Modification d'un engagement (ex: like -> dislike)
          const prevType = previousDoc.type
          if (type !== prevType) {
            if (type === 'like' && prevType === 'dislike') {
              await updateCounts(1, -1)
            } else if (type === 'dislike' && prevType === 'like') {
              await updateCounts(-1, 1)
            }
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const challengeId = doc.challenge
        const type = doc.type
        const payload = req.payload

        // On cherche l'agrégat pour ce challenge
        const [aggregate] = await payload
          .find({
            collection: 'challenges-engagement',
            where: { challenge: { equals: challengeId } },
            limit: 1,
          })
          .then((res) => res.docs)

        if (aggregate) {
          let likesDelta = 0
          let dislikesDelta = 0
          if (type === 'like') likesDelta = -1
          if (type === 'dislike') dislikesDelta = -1
          await payload.update({
            collection: 'challenges-engagement',
            id: aggregate.id,
            data: {
              likes: (aggregate.likes || 0) + likesDelta,
              dislikes: (aggregate.dislikes || 0) + dislikesDelta,
            },
            req,
          })
        }
      },
    ],
  },
}
