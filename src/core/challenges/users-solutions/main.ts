import { Tag, Comment, UserSolution as PayloadUserSolution } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

type UserSolution = {
  id: number
  authorId: string
  challengeId: number // On doit pouvoir récupérer le challenge associé à la solution
  details: {
    title: string
    description: string
    content: string
  }
  metrics: {
    votes: {
      status: 'upvote' | 'downvote'
      authorId: string
    }[]
    views: number
    comments: Comment[]
  }
  tags: Tag[]
  reports: {
    userId: string
    reason: string
    details?: string
    createdAt: Date
  }[]
  createdAt: Date
}

export const getPayloadUserSolution = async (solutionId: number): Promise<PayloadUserSolution> => {
  const payload = await getPayload({ config })
  
  const solution = await payload.find({
    collection: 'user-solutions',
    where: { id: { equals: solutionId } },
  })
  
  return solution
}

